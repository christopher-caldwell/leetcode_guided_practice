import { readFile } from 'node:fs/promises'
import ts from 'typescript'
import type { CheckFailure, LessonManifest } from '../core/models.js'

interface SourcePolicy {
  functionName: string
  noAuxiliaryCollection?: boolean
  forbiddenMethods?: string[]
  requiredConstructors?: string[]
  minimumLoopNesting?: number
}

const policies: Record<string, SourcePolicy[]> = {
  '02-pair-sum-baseline': [{ functionName: 'pairSumBaseline', minimumLoopNesting: 2 }],
  '03-pair-sum-at-scale': [{ functionName: 'pairSumAtScale', requiredConstructors: ['Map'] }],
  '04-inventory-reconciliation': [
    { functionName: 'sameInventory', forbiddenMethods: ['sort', 'toSorted'] },
  ],
  '05-compact-sorted-identifiers': [
    { functionName: 'compactSortedIds', noAuxiliaryCollection: true },
  ],
  '12-cyclic-dependency-chain': [{ functionName: 'hasCycle', noAuxiliaryCollection: true }],
  '18-hierarchy-by-level': [{ functionName: 'levelOrder', forbiddenMethods: ['shift'] }],
  '19-highest-priority-items': [
    {
      functionName: 'topKFrequent',
      forbiddenMethods: ['sort', 'toSorted'],
      requiredConstructors: ['MinPriorityQueue'],
    },
  ],
  '23-non-adjacent-value': [{ functionName: 'maxNonAdjacentValue', noAuxiliaryCollection: true }],
}

const collectionProducingMethods = new Set([
  'concat',
  'filter',
  'flat',
  'flatMap',
  'map',
  'slice',
  'toSorted',
  'toSpliced',
])

const collectionConstructors = new Set(['Array', 'Map', 'Set', 'WeakMap', 'WeakSet'])

export async function validateSourcePolicies(
  lesson: LessonManifest,
  sourcePath: string,
): Promise<CheckFailure[]> {
  const policy = policies[lesson.id]
  if (!policy) return []
  return validateSourceText(lesson.id, await readFile(sourcePath, 'utf8'), sourcePath)
}

export function validateSourceText(
  lessonId: string,
  source: string,
  sourceName = 'solution.ts',
): CheckFailure[] {
  const lessonPolicies = policies[lessonId]
  if (!lessonPolicies) return []
  const sourceFile = ts.createSourceFile(
    sourceName,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  )
  const failures: CheckFailure[] = []
  const functionBodies = findFunctionBodies(sourceFile)

  for (const policy of lessonPolicies) {
    const body = functionBodies.get(policy.functionName)
    if (!body) {
      failures.push({
        category: 'complexity',
        summary: `${policy.functionName} must be declared directly in the submitted module.`,
        evidence:
          'The verifier could not locate the assessed function body, so its data-structure and operation-cost contract could not be checked.',
      })
      continue
    }
    const reachableBodies = collectReachableBodies(body, functionBodies)

    if (
      policy.minimumLoopNesting !== undefined &&
      Math.max(...reachableBodies.map((reachable) => maximumLoopNesting(reachable))) <
        policy.minimumLoopNesting
    ) {
      failures.push({
        category: 'complexity',
        summary: `${policy.functionName} must use the lesson's exhaustive nested-loop baseline.`,
        evidence: `This lesson deliberately establishes pairwise O(n²) work before the Map optimization. Use nested loops with depth ${policy.minimumLoopNesting}.`,
      })
    }

    if (policy.noAuxiliaryCollection) {
      const allocation = findNodeInBodies(reachableBodies, (node) =>
        isAuxiliaryCollectionAllocation(node, reachableBodies),
      )
      if (allocation) {
        failures.push(
          policyFailure(
            sourceFile,
            allocation,
            `${policy.functionName} allocates collection-shaped auxiliary state.`,
            'This lesson requires O(1) auxiliary space. Use scalar variables and the existing input/node references instead of constructing or copying a collection.',
          ),
        )
      }
    }

    for (const method of policy.forbiddenMethods ?? []) {
      const call = findNodeInBodies(reachableBodies, (node) =>
        isForbiddenMethodCall(node, method, reachableBodies),
      )
      if (call) {
        failures.push(
          policyFailure(
            sourceFile,
            call,
            `${policy.functionName} uses the disallowed .${method}() operation.`,
            `The lesson contract excludes .${method}() because it bypasses the operation-cost or data-structure skill being assessed.`,
          ),
        )
      }
    }

    for (const constructorName of policy.requiredConstructors ?? []) {
      if (!hasMeaningfulConstruction(reachableBodies, constructorName)) {
        failures.push({
          category: 'complexity',
          summary: `${policy.functionName} must construct and use ${constructorName}.`,
          evidence:
            'The supplied data structure is part of this lesson contract; output-only tests cannot establish that it was used.',
        })
      }
    }
  }

  return failures
}

function findFunctionBodies(sourceFile: ts.SourceFile): Map<string, ts.ConciseBody> {
  const bodies = new Map<string, ts.ConciseBody>()
  for (const statement of sourceFile.statements) {
    if (ts.isFunctionDeclaration(statement) && statement.name && statement.body) {
      bodies.set(statement.name.text, statement.body)
      continue
    }
    if (!ts.isVariableStatement(statement)) continue
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name)) continue
      if (
        declaration.initializer &&
        (ts.isArrowFunction(declaration.initializer) ||
          ts.isFunctionExpression(declaration.initializer))
      ) {
        bodies.set(declaration.name.text, declaration.initializer.body)
      }
    }
  }
  return bodies
}

function collectReachableBodies(
  entry: ts.ConciseBody,
  functionBodies: Map<string, ts.ConciseBody>,
): ts.ConciseBody[] {
  const reachable: ts.ConciseBody[] = []
  const pending = [entry]
  const visited = new Set<ts.ConciseBody>()
  while (pending.length > 0) {
    const body = pending.pop()!
    if (visited.has(body)) continue
    visited.add(body)
    reachable.push(body)
    body.forEachChild(function visit(node) {
      if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
        const called = functionBodies.get(node.expression.text)
        if (called && !visited.has(called)) pending.push(called)
      }
      node.forEachChild(visit)
    })
  }
  return reachable
}

function isAuxiliaryCollectionAllocation(node: ts.Node, bodies: ts.Node[]): boolean {
  if (ts.isObjectLiteralExpression(node)) return false
  if (ts.isArrayLiteralExpression(node)) {
    if (node.elements.some(ts.isSpreadElement) || node.elements.length > 4) return true
    const declaration = node.parent
    if (!ts.isVariableDeclaration(declaration) || !ts.isIdentifier(declaration.name)) return false
    return hasInputSizedArrayMutation(bodies, declaration.name.text)
  }
  if (
    ts.isNewExpression(node) &&
    ts.isIdentifier(node.expression) &&
    collectionConstructors.has(node.expression.text)
  )
    return true
  if (!ts.isCallExpression(node)) return false
  if (
    ts.isPropertyAccessExpression(node.expression) &&
    collectionProducingMethods.has(node.expression.name.text)
  )
    return true
  return (
    ts.isPropertyAccessExpression(node.expression) &&
    ts.isIdentifier(node.expression.expression) &&
    node.expression.expression.text === 'Array' &&
    (node.expression.name.text === 'from' || node.expression.name.text === 'of')
  )
}

function hasInputSizedArrayMutation(bodies: ts.Node[], identifier: string): boolean {
  return Boolean(
    findNodeInBodies(bodies, (node) => {
      if (
        ts.isCallExpression(node) &&
        ts.isPropertyAccessExpression(node.expression) &&
        ts.isIdentifier(node.expression.expression) &&
        node.expression.expression.text === identifier &&
        ['push', 'unshift', 'splice'].includes(node.expression.name.text)
      )
        return true
      return (
        ts.isBinaryExpression(node) &&
        ts.isElementAccessExpression(node.left) &&
        ts.isIdentifier(node.left.expression) &&
        node.left.expression.text === identifier &&
        node.operatorToken.kind >= ts.SyntaxKind.FirstAssignment &&
        node.operatorToken.kind <= ts.SyntaxKind.LastAssignment
      )
    }),
  )
}

function isForbiddenMethodCall(node: ts.Node, method: string, bodies: ts.Node[]): boolean {
  if (
    !ts.isCallExpression(node) ||
    !ts.isPropertyAccessExpression(node.expression) ||
    node.expression.name.text !== method
  )
    return false
  if (method !== 'shift') return true
  const receiver = node.expression.expression
  if (ts.isArrayLiteralExpression(receiver)) return true
  if (!ts.isIdentifier(receiver)) return false
  return Boolean(
    findNodeInBodies(bodies, (candidate) => {
      if (
        ts.isVariableDeclaration(candidate) &&
        ts.isIdentifier(candidate.name) &&
        candidate.name.text === receiver.text
      ) {
        const initializer = candidate.initializer
        return Boolean(
          initializer &&
          (ts.isArrayLiteralExpression(initializer) ||
            (ts.isNewExpression(initializer) &&
              ts.isIdentifier(initializer.expression) &&
              initializer.expression.text === 'Array') ||
            (ts.isCallExpression(initializer) &&
              ts.isPropertyAccessExpression(initializer.expression) &&
              ts.isIdentifier(initializer.expression.expression) &&
              initializer.expression.expression.text === 'Array' &&
              initializer.expression.name.text === 'from')),
        )
      }
      return (
        ts.isParameter(candidate) &&
        ts.isIdentifier(candidate.name) &&
        candidate.name.text === receiver.text &&
        Boolean(
          candidate.type &&
          (ts.isArrayTypeNode(candidate.type) ||
            (ts.isTypeReferenceNode(candidate.type) &&
              ts.isIdentifier(candidate.type.typeName) &&
              candidate.type.typeName.text === 'Array')),
        )
      )
    }),
  )
}

function hasMeaningfulConstruction(bodies: ts.Node[], constructorName: string): boolean {
  const construction = findNodeInBodies(
    bodies,
    (node) =>
      ts.isNewExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === constructorName,
  )
  if (!construction || !ts.isNewExpression(construction)) return false
  const declaration = construction.parent
  if (!ts.isVariableDeclaration(declaration) || !ts.isIdentifier(declaration.name)) return false
  const bindingName = declaration.name.text
  let references = 0
  for (const body of bodies) {
    body.forEachChild(function visit(node) {
      if (ts.isIdentifier(node) && node.text === bindingName) references += 1
      node.forEachChild(visit)
    })
  }
  return references > 1
}

function findNodeInBodies(
  bodies: ts.Node[],
  predicate: (node: ts.Node) => boolean,
): ts.Node | null {
  for (const body of bodies) {
    const result = findNode(body, predicate)
    if (result) return result
  }
  return null
}

function maximumLoopNesting(root: ts.Node, depth = 0): number {
  const isLoop =
    ts.isForStatement(root) ||
    ts.isForInStatement(root) ||
    ts.isForOfStatement(root) ||
    ts.isWhileStatement(root) ||
    ts.isDoStatement(root)
  const currentDepth = depth + (isLoop ? 1 : 0)
  let maximum = currentDepth
  root.forEachChild((child) => {
    maximum = Math.max(maximum, maximumLoopNesting(child, currentDepth))
  })
  return maximum
}

function findNode(root: ts.Node, predicate: (node: ts.Node) => boolean): ts.Node | null {
  if (predicate(root)) return root
  let result: ts.Node | null = null
  root.forEachChild((child) => {
    if (!result) result = findNode(child, predicate)
  })
  return result
}

function policyFailure(
  sourceFile: ts.SourceFile,
  node: ts.Node,
  summary: string,
  evidence: string,
): CheckFailure {
  const location = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile))
  return {
    category: 'complexity',
    summary,
    evidence: `${evidence} (${sourceFile.fileName}:${location.line + 1}:${location.character + 1})`,
  }
}
