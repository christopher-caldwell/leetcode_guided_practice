# 16. Checkpoint III: Minimum Processing Rate

## Interview skill being developed

mixed retrieval, monotonic feasibility reasoning. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Lessons 12–15. The relevant pattern is intentionally not announced.

## Problem statement

A worker processes one job per hour and can complete up to rate units from that job. Return the smallest positive integer rate that completes all jobs within hours. A partially processed hour still consumes a full hour.

### Examples

- `minimumProcessingRate([3, 6, 7, 11], 8) -> 4`
- `minimumProcessingRate([30], 5) -> 6`

### Constraints

- 1 <= jobs.length <= 100,000
- 1 <= jobs[i] <= 1,000,000,000
- jobs.length <= hours <= 1,000,000,000

## Contract checks

- Can time be shared between jobs in one hour?
- Must the rate be an integer?
- Is a feasible rate necessarily minimal?

These are prompts, not required individual answers. In `lessons/16-checkpoint-processing-rate/analysis.md`, record only a contract detail that affected your implementation.

## Expected workflow

1. Read the contract and choose one representative edge case.
2. Implement inside the TODO boundary.
3. Run `just check`; PASS or FAIL reflects code verification only.
4. Explain the solution in `analysis.md`; after code passes, Codex evaluates the analysis and solution together.

## Editable files and TODO boundary

- Reasoning: `lessons/16-checkpoint-processing-rate/analysis.md`
- Implementation: `lessons/16-checkpoint-processing-rate/solutions/typescript/solution.ts`
- Visible examples: `lessons/16-checkpoint-processing-rate/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Check and progression

`just check` always runs the TypeScript and registered lesson verifiers first. Their PASS or FAIL reflects code verification. After code passes, Codex reads the analysis and submitted solution together, returns a separate analysis PASS or FAIL, and provides feedback in either case. It judges the meaning rather than requiring exact headings, keywords, or phrasing. The lesson advances when both verdicts pass.

A guarded large-range case rejects linear candidate-rate search while remaining independent of wall-clock speed.

## Common traps

- Linearly trying every possible rate up to the largest job.
- Using floor division for partially completed hours.
- Overflowing an accumulated hour count in other interview languages.

## Optional follow-up

After the lesson advances, consider this variation:

> How would the feasibility calculation change if unused hourly capacity could continue into the next job?

Do not code the variation unless you want extra practice.
