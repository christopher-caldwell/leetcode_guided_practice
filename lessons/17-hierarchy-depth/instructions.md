# 17. Measure Hierarchy Depth

## Interview skill being developed

tree recursion, depth-first search, structural induction. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Recursion from Lesson 15. TreeNode is supplied.

## Problem statement

Return the number of nodes on the longest path from a binary tree root to a leaf. An empty tree has depth 0.

### Examples

- `A root with two leaf children has depth 2.`
- `maxDepth(null) -> 0`

### Constraints

- 0 <= node count <= 100,000
- Maximum tree height is 1,000. The tree may be highly skewed within that bound.
- Do not mutate nodes.

## Clarifying questions to consider

- Is depth measured in nodes or edges?
- What is the empty-tree base case?
- Can the tree be skewed like a linked list?

Write your actual assumptions and answers in `lessons/17-hierarchy-depth/analysis.md` before coding.

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

- Reasoning: `lessons/17-hierarchy-depth/analysis.md`
- Implementation: `lessons/17-hierarchy-depth/solutions/typescript/solution.ts`
- Visible examples: `lessons/17-hierarchy-depth/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Automated pass condition

All required analysis sections must contain your reasoning. The TypeScript project must type-check, public examples and internal deterministic cases must pass, the input contract must be preserved, and any complexity guard for this lesson must pass. Failure output labels the category without dumping internal case details wholesale.

## Common traps

- Combining child depths by addition instead of selecting a path.
- Returning 1 for an empty tree.
- Ignoring O(h) call-stack space and the finite recursion depth of the Node.js runtime.

## Post-pass reflection

After CODE VERIFIED, record what observation unlocked the efficient approach, which invariant you would say aloud, and what you would do differently on a fresh problem. Run `just check` again to advance, then consider this variation:

> How would you return whether the tree is height-balanced while avoiding repeated depth calculations?

Do not code the variation unless you want extra practice.
