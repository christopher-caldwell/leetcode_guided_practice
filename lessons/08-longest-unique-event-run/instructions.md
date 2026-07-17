# 08. Longest Unique Event Run

## Interview skill being developed

variable sliding windows, window invariants, last-seen information. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Lessons 3, 6, and 7.

## Problem statement

Return the length of the longest contiguous portion of an event stream containing no repeated event identifier.

### Examples

- `longestUniqueRun(['a', 'b', 'c', 'a', 'b']) -> 3`
- `longestUniqueRun(['x', 'x']) -> 1`

### Constraints

- 0 <= events.length <= 100,000
- Identifiers are case-sensitive.
- Do not mutate the input.

## Contract checks

- Is the result a length or the segment itself?
- Does contiguous matter?
- What is the empty-input result?

These are prompts, not required individual answers. In `lessons/08-longest-unique-event-run/analysis.md`, record only a contract detail that affected your implementation.

## Expected workflow

1. Read the contract and choose one representative edge case.
2. Implement inside the TODO boundary.
3. Run `just check`; PASS or FAIL reflects code verification only.
4. Add the three concise interview notes in `analysis.md` to advance.

## Editable files and TODO boundary

- Reasoning: `lessons/08-longest-unique-event-run/analysis.md`
- Implementation: `lessons/08-longest-unique-event-run/solutions/typescript/solution.ts`
- Visible examples: `lessons/08-longest-unique-event-run/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Check and progression

`just check` always runs the TypeScript and registered lesson verifiers. PASS or FAIL reflects those checks only. The lesson advances after the three concise analysis notes are complete; missing notes display WAITING without changing a PASS into a failure.

## Common traps

- Resetting the entire candidate segment after a duplicate.
- Moving the left boundary backward because of an old occurrence.
- Confusing a subsequence with a contiguous window.

## Optional follow-up

After the lesson advances, consider this variation:

> How would the invariant change if at most two occurrences of each event were permitted?

Do not code the variation unless you want extra practice.
