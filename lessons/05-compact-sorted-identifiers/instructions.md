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

## Clarifying questions to consider

- Which part of the mutated array is observable?
- What should empty input return?
- May values after the returned length remain unchanged?

Write your actual assumptions and answers in `lessons/05-compact-sorted-identifiers/analysis.md` before coding.

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

- Reasoning: `lessons/05-compact-sorted-identifiers/analysis.md`
- Implementation: `lessons/05-compact-sorted-identifiers/solutions/typescript/solution.ts`
- Visible examples: `lessons/05-compact-sorted-identifiers/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Automated pass condition

All required analysis sections must contain your reasoning. The TypeScript project must type-check, public examples and internal deterministic cases must pass, the input contract must be preserved, and any complexity guard for this lesson must pass. Failure output labels the category without dumping internal case details wholesale.

Because output tests cannot measure auxiliary allocation reliably, a focused TypeScript source policy rejects collection construction or copying inside `compactSortedIds`.

## Common traps

- Returning the number of duplicate values rather than unique values.
- Reading an unwritten slot as if it belonged to the compacted prefix.
- Ignoring the sorted-order fact that makes adjacent comparison meaningful.

## Post-pass reflection

After CODE VERIFIED, record what observation unlocked the efficient approach, which invariant you would say aloud, and what you would do differently on a fresh problem. Run `just check` again to advance, then consider this variation:

> How would the write boundary change if each distinct value could appear at most twice?

Do not code the variation unless you want extra practice.
