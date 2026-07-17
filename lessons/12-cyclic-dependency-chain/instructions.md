# 12. Detect a Cyclic Dependency Chain

## Interview skill being developed

fast and slow pointers, linked-list cycles, constant-space reasoning. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Linked-list traversal from Lesson 10.

## Problem statement

Return true if following next references from head eventually revisits a node. Do not modify nodes and use O(1) auxiliary space.

### Examples

- `1 -> 2 -> 3 -> node 2 returns true`
- `1 -> 2 -> null returns false`

### Constraints

- 0 <= reachable node count <= 100,000
- Node values do not determine identity.
- Use O(1) space.

## Contract checks

- Is a repeated value the same as a repeated node?
- May nodes be marked or modified?
- What happens for a self-cycle?

These are prompts, not required individual answers. In `lessons/12-cyclic-dependency-chain/analysis.md`, record only a contract detail that affected your implementation.

## Expected workflow

1. Read the contract and choose one representative edge case.
2. Implement inside the TODO boundary.
3. Run `just check`; PASS or FAIL reflects code verification only.
4. Explain the solution in `analysis.md`; after code passes, Codex evaluates the analysis and solution together.

## Editable files and TODO boundary

- Reasoning: `lessons/12-cyclic-dependency-chain/analysis.md`
- Implementation: `lessons/12-cyclic-dependency-chain/solutions/typescript/solution.ts`
- Visible examples: `lessons/12-cyclic-dependency-chain/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Check and progression

`just check` always runs the TypeScript and registered lesson verifiers first. Their PASS or FAIL reflects code verification. After code passes, Codex reads the analysis and submitted solution together, returns a separate analysis PASS or FAIL, and provides feedback in either case. It judges the meaning rather than requiring exact headings, keywords, or phrasing. The lesson advances when both verdicts pass.

A focused TypeScript source policy rejects auxiliary collection construction inside `hasCycle`, and a contract case confirms that node values and links remain unchanged.

## Common traps

- Comparing node values instead of references.
- Dereferencing two steps ahead without a null check.
- Using a Set despite the constant-space contract.

## Optional follow-up

After the lesson advances, consider this variation:

> How could you find the node where the cycle begins after proving a cycle exists?

Do not code the variation unless you want extra practice.
