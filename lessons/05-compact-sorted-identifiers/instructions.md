# 05. Compact Sorted Identifiers

## Interview skill being developed

two pointers, in-place mutation, write-boundary invariants. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Lessons 1–4 and array mutation semantics.

## Problem statement

Given a nondecreasing array, move each distinct value into the first k positions in place and return k. Values after k are irrelevant. Allocate no collection proportional to input size.

### Examples

- `compactSortedIds([1, 1, 2]) -> 2 and the prefix becomes [1, 2]`
- `compactSortedIds([]) -> 0`

### Constraints

- 0 <= ids.length <= 100,000
- Values may be negative.
- The input is sorted.
- Use O(1) auxiliary space.

## Contract checks

- Which part of the mutated array is observable?
- What should empty input return?
- May values after the returned length remain unchanged?

These are prompts, not required individual answers. In `lessons/05-compact-sorted-identifiers/analysis.md`, record only a contract detail that affected your implementation.

## Expected workflow

1. Read the contract and choose one representative edge case.
2. Implement inside the TODO boundary.
3. Run `just check`; PASS or FAIL reflects code verification only.
4. Add the three concise interview notes in `analysis.md` to advance.

## Editable files and TODO boundary

- Reasoning: `lessons/05-compact-sorted-identifiers/analysis.md`
- Implementation: `lessons/05-compact-sorted-identifiers/solutions/typescript/solution.ts`
- Visible examples: `lessons/05-compact-sorted-identifiers/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Check and progression

`just check` always runs the TypeScript and registered lesson verifiers. PASS or FAIL reflects those checks only. The lesson advances after the three concise analysis notes are complete; missing notes display WAITING without changing a PASS into a failure.

Because output tests cannot measure auxiliary allocation reliably, a focused TypeScript source policy rejects collection construction or copying inside `compactSortedIds`.

## Common traps

- Returning the number of duplicate values rather than unique values.
- Reading an unwritten slot as if it belonged to the compacted prefix.
- Ignoring the sorted-order fact that makes adjacent comparison meaningful.

## Optional follow-up

After the lesson advances, consider this variation:

> How would the write boundary change if each distinct value could appear at most twice?

Do not code the variation unless you want extra practice.
