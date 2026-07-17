# 10. Merge Sorted Event Streams

## Interview skill being developed

linked-list traversal, pointer invariants, sentinel nodes. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Two-pointer reasoning from Lesson 5. ListNode is supplied.

## Problem statement

Merge two nondecreasing singly linked lists into one nondecreasing list. Reuse existing nodes; do not allocate replacement nodes except an optional sentinel.

### Examples

- `[1, 2, 4] plus [1, 3, 4] -> [1, 1, 2, 3, 4, 4]`
- `null plus [0] -> [0]`

### Constraints

- 0 <= combined node count <= 50,000
- Node values may be negative.
- Inputs contain no cycles.

## Contract checks

- May existing nodes be relinked?
- What should happen when one list is empty?
- Must equal values preserve their original cross-list order?

These are prompts, not required individual answers. In `lessons/10-merge-sorted-streams/analysis.md`, record only a contract detail that affected your implementation.

## Expected workflow

1. Read the contract and choose one representative edge case.
2. Implement inside the TODO boundary.
3. Run `just check`; PASS or FAIL reflects code verification only.
4. Explain the solution in `analysis.md`; after code passes, Codex evaluates the analysis and solution together.

## Editable files and TODO boundary

- Reasoning: `lessons/10-merge-sorted-streams/analysis.md`
- Implementation: `lessons/10-merge-sorted-streams/solutions/typescript/solution.ts`
- Visible examples: `lessons/10-merge-sorted-streams/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Check and progression

`just check` always runs the TypeScript and registered lesson verifiers first. Their PASS or FAIL reflects code verification. After code passes, Codex reads the analysis and submitted solution together, returns a separate analysis PASS or FAIL, and provides feedback in either case. It judges the meaning rather than requiring exact headings, keywords, or phrasing. The lesson advances when both verdicts pass.

## Common traps

- Losing the remaining portion after changing a next pointer.
- Returning the moving tail instead of the merged head.
- Forgetting that one list can have unconsumed nodes after the other ends.

## Optional follow-up

After the lesson advances, consider this variation:

> How would you merge k sorted linked lists, and which operation becomes the bottleneck?

Do not code the variation unless you want extra practice.
