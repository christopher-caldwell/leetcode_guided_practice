import { readFile } from 'node:fs/promises'
import ts from 'typescript'
import type { CheckFailure, LessonManifest } from '../core/models.js'

interface SourcePolicy {
  functionName: string
  noAuxiliaryCollection?: boolean
  forbiddenMethods?: string[]
  requiredConstructors?: string[]
}

const policies: Record<string, SourcePolicy[]> = {
  '03-pair-sum-at-scale': [{ functionName: 'pairSumAtScale', requiredConstructors: ['Map'] }],
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

  for (const policy of lessonPolicies) {
    const body = findFunctionBody(sourceFile, policy.functionName)
    if (!body) continue

    if (policy.noAuxiliaryCollection) {
      const allocation = findNode(body, isAuxiliaryCollectionAllocation)
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
      const call = findNode(
        body,
        (node) =>
          ts.isCallExpression(node) &&
          ts.isPropertyAccessExpression(node.expression) &&
          node.expression.name.text === method,
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
      const construction = findNode(
        body,
        (node) =>
          ts.isNewExpression(node) &&
          ts.isIdentifier(node.expression) &&
          node.expression.text === constructorName,
      )
      if (!construction) {
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

function findFunctionBody(sourceFile: ts.SourceFile, functionName: string): ts.ConciseBody | null {
  for (const statement of sourceFile.statements) {
    if (ts.isFunctionDeclaration(statement) && statement.name?.text === functionName) {
      return statement.body ?? null
    }
    if (!ts.isVariableStatement(statement)) continue
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || declaration.name.text !== functionName) continue
      if (
        declaration.initializer &&
        (ts.isArrowFunction(declaration.initializer) ||
          ts.isFunctionExpression(declaration.initializer))
      ) {
        return declaration.initializer.body
      }
    }
  }
  return null
}

function isAuxiliaryCollectionAllocation(node: ts.Node): boolean {
  if (ts.isArrayLiteralExpression(node) || ts.isObjectLiteralExpression(node)) return true
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
