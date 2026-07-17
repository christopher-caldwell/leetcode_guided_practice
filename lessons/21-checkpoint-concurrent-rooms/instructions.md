# 21. Checkpoint IV: Concurrent Rooms

## Interview skill being developed

mixed retrieval, resource-lifetime reasoning. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Lessons 17–20. The relevant pattern is intentionally not announced.

## Problem statement

Return the minimum number of rooms required for all half-open meetings [start, end). A meeting ending at time t frees its room for one starting at t. Do not mutate input.

### Examples

- `minimumConcurrentRooms([[0, 30], [5, 10], [15, 20]]) -> 2`
- `minimumConcurrentRooms([[7, 10], [10, 12]]) -> 1`

### Constraints

- 0 <= meetings.length <= 100,000
- start < end
- Input order is arbitrary.

## Contract checks

- Can a room be reused at an equal endpoint?
- Is the desired value total meetings or peak concurrency?
- May meetings be sorted in place?

These are prompts, not required individual answers. In `lessons/21-checkpoint-concurrent-rooms/analysis.md`, record only a contract detail that affected your implementation.

## Expected workflow

1. Read the contract and choose one representative edge case.
2. Implement inside the TODO boundary.
3. Run `just check`; PASS or FAIL reflects code verification only.
4. Explain the solution in `analysis.md`; after code passes, Codex evaluates the analysis and solution together.

## Editable files and TODO boundary

- Reasoning: `lessons/21-checkpoint-concurrent-rooms/analysis.md`
- Implementation: `lessons/21-checkpoint-concurrent-rooms/solutions/typescript/solution.ts`
- Visible examples: `lessons/21-checkpoint-concurrent-rooms/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Check and progression

`just check` always runs the TypeScript and registered lesson verifiers first. Their PASS or FAIL reflects code verification. After code passes, Codex reads the analysis and submitted solution together, returns a separate analysis PASS or FAIL, and provides feedback in either case. It judges the meaning rather than requiring exact headings, keywords, or phrasing. The lesson advances when both verdicts pass.

The verifier exercises 20,000 simultaneously active meetings, rejecting pairwise overlap counting while allowing either a heap-based or sorted-endpoint solution.

## Common traps

- Treating touching half-open meetings as overlapping.
- Tracking every finished room when only reusable capacity matters.
- Returning the final active count instead of the peak resource count.

## Optional follow-up

After the lesson advances, consider this variation:

> How would you also assign a concrete room identifier to every meeting?

Do not code the variation unless you want extra practice.
