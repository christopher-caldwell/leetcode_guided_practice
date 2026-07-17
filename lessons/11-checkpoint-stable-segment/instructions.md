# 11. Checkpoint II: Longest Stable Segment

## Interview skill being developed

mixed retrieval, invariant-driven optimization. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Lessons 7–10. The relevant pattern is intentionally not announced.

## Problem statement

Return the length of the longest contiguous event segment containing no more than allowedKinds distinct identifiers. Return 0 for empty input or when allowedKinds is nonpositive.

### Examples

- `longestStableSegment(['a', 'b', 'a', 'c'], 2) -> 3`
- `longestStableSegment(['a', 'a'], 1) -> 2`

### Constraints

- 0 <= events.length <= 100,000
- 0 <= allowedKinds <= 100,000
- Do not mutate input.

## Contract checks

- Does no more than permit fewer kinds?
- Must the result be contiguous?
- What should nonpositive allowedKinds return?

These are prompts, not required individual answers. In `lessons/11-checkpoint-stable-segment/analysis.md`, record only a contract detail that affected your implementation.

## Expected workflow

1. Read the contract and choose one representative edge case.
2. Implement inside the TODO boundary.
3. Run `just check`; PASS or FAIL reflects code verification only.
4. Add the three concise interview notes in `analysis.md` to advance.

## Editable files and TODO boundary

- Reasoning: `lessons/11-checkpoint-stable-segment/analysis.md`
- Implementation: `lessons/11-checkpoint-stable-segment/solutions/typescript/solution.ts`
- Visible examples: `lessons/11-checkpoint-stable-segment/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Check and progression

`just check` always runs the TypeScript and registered lesson verifiers. PASS or FAIL reflects those checks only. The lesson advances after the three concise analysis notes are complete; missing notes display WAITING without changing a PASS into a failure.

## Common traps

- Keeping a segment after its distinct-kind constraint has been violated.
- Removing an identifier before its final occurrence leaves the segment.
- Rebuilding distinct counts for every candidate segment.

## Optional follow-up

After the lesson advances, consider this variation:

> How would you return the segment boundaries and resolve ties by earliest start?

Do not code the variation unless you want extra practice.
