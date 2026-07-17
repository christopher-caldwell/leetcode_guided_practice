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

## Contract checks

- Is depth measured in nodes or edges?
- What is the empty-tree base case?
- Can the tree be skewed like a linked list?

These are prompts, not required individual answers. In `lessons/17-hierarchy-depth/analysis.md`, record only a contract detail that affected your implementation.

## Expected workflow

1. Read the contract and choose one representative edge case.
2. Implement inside the TODO boundary.
3. Run `just check`; PASS or FAIL reflects code verification only.
4. Explain the solution in `analysis.md`; after code passes, Codex evaluates the analysis and solution together.

## Editable files and TODO boundary

- Reasoning: `lessons/17-hierarchy-depth/analysis.md`
- Implementation: `lessons/17-hierarchy-depth/solutions/typescript/solution.ts`
- Visible examples: `lessons/17-hierarchy-depth/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Check and progression

`just check` always runs the TypeScript and registered lesson verifiers first. Their PASS or FAIL reflects code verification. After code passes, Codex reads the analysis and submitted solution together, returns a separate analysis PASS or FAIL, and provides feedback in either case. It judges the meaning rather than requiring exact headings, keywords, or phrasing. The lesson advances when both verdicts pass.

## Common traps

- Combining child depths by addition instead of selecting a path.
- Returning 1 for an empty tree.
- Ignoring O(h) call-stack space and the finite recursion depth of the Node.js runtime.

## Optional follow-up

After the lesson advances, consider this variation:

> How would you return whether the tree is height-balanced while avoiding repeated depth calculations?

Do not code the variation unless you want extra practice.
