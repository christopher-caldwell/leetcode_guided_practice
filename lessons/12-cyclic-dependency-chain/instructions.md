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

## Clarifying questions to consider

- Is a repeated value the same as a repeated node?
- May nodes be marked or modified?
- What happens for a self-cycle?

Write your actual assumptions and answers in `lessons/12-cyclic-dependency-chain/analysis.md` before coding.

## Expected workflow

1. Restate the contract and walk through a small example.
2. Propose a correct baseline, even if it is too expensive.
3. Define `n` and analyze the baseline's time and auxiliary space.
4. Identify the repeated or expensive operation.
5. Derive an optimization and state its invariant.
6. Implement only inside the TODO boundary.
7. Run `just check`, inspect the failure category, and test your own edge cases.
8. Explain why the final algorithm is correct and state its complexity.

## Editable files and TODO boundary

- Reasoning: `lessons/12-cyclic-dependency-chain/analysis.md`
- Implementation: `lessons/12-cyclic-dependency-chain/solutions/typescript/solution.ts`
- Visible examples: `lessons/12-cyclic-dependency-chain/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Automated pass condition

All required analysis sections must contain your reasoning. The TypeScript project must type-check, public examples and internal deterministic cases must pass, the input contract must be preserved, and any complexity guard for this lesson must pass. Failure output labels the category without dumping internal case details wholesale.

A focused TypeScript source policy rejects auxiliary collection construction inside `hasCycle`, and a contract case confirms that node values and links remain unchanged.

## Common traps

- Comparing node values instead of references.
- Dereferencing two steps ahead without a null check.
- Using a Set despite the constant-space contract.

## Post-pass reflection

After CODE VERIFIED, record what observation unlocked the efficient approach, which invariant you would say aloud, and what you would do differently on a fresh problem. Run `just check` again to advance, then consider this variation:

> How could you find the node where the cycle begins after proving a cycle exists?

Do not code the variation unless you want extra practice.
