# 01. Find the First Matching Record

## Interview skill being developed

input contracts, linear scans, operation counting, O(n) reasoning. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Comfort reading and writing a TypeScript loop.

## Problem statement

Given an array of numbers and a target, return the index of the first matching value. Return -1 when the target is absent. Do not mutate the input.

### Examples

- `findFirstIndex([4, 8, 4], 4) -> 0`
- `findFirstIndex([4, 8], 3) -> -1`

### Constraints

- 0 <= values.length <= 100,000
- Values may be negative or duplicated.

## Contract checks

- What should happen for an empty array?
- Does first mean the lowest index?
- May the function mutate its input?

These are prompts, not required individual answers. In `lessons/01-linear-scan/analysis.md`, record only a contract detail that affected your implementation.

## Expected workflow

1. Read the contract and choose one representative edge case.
2. Implement inside the TODO boundary.
3. Run `just check`; PASS or FAIL reflects code verification only.
4. Add the three concise interview notes in `analysis.md` to advance.

## Editable files and TODO boundary

- Reasoning: `lessons/01-linear-scan/analysis.md`
- Implementation: `lessons/01-linear-scan/solutions/typescript/solution.ts`
- Visible examples: `lessons/01-linear-scan/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Check and progression

`just check` always runs the TypeScript and registered lesson verifiers. PASS or FAIL reflects those checks only. The lesson advances after the three concise analysis notes are complete; missing notes display WAITING without changing a PASS into a failure.

## Common traps

- Returning a value instead of its index.
- Continuing to scan after the first match.
- Describing the cost without defining n.

## Optional follow-up

After the lesson advances, consider this variation:

> How would the contract and complexity change if all matching indices were required?

Do not code the variation unless you want extra practice.
