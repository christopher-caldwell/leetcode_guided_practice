# Algorithm Interview Workshop

This is a follow-along TypeScript workshop for an experienced application engineer who is new to LeetCode-style algorithm interviews. It teaches a repeatable reasoning process: clarify the contract, establish a correct baseline, identify the costly operation, derive an optimization, prove it, and communicate complexity.

The project contains 24 progressively checked lessons. The CLI tracks local progress and always tells you which instruction, analysis, and source files to open next.

## Requirements

- Node.js 22 or newer
- pnpm 10 or newer
- [just](https://github.com/casey/just)
- Optional: an installed and authenticated Codex CLI for adaptive coaching

No OpenAI API key or direct OpenAI API integration is used. When enabled, coaching invokes your existing authenticated `codex exec` CLI.

## Start here

```bash
cp .env.example .env
just bootstrap
just status
```

Then open the three paths printed by `just status`. For lesson 1 these are:

- `lessons/01-linear-scan/instructions.md`
- `lessons/01-linear-scan/analysis.md`
- `lessons/01-linear-scan/solutions/typescript/solution.ts`

Run your first check with:

```bash
just check
```

Starter solutions intentionally fail their registered code checks. After code passes, Codex evaluates the interview explanation semantically and reports a separate analysis verdict.

## Daily workflow

```bash
just status       # See the current lesson and exact files to open
just start        # Print those files and deliberately start timing when applicable
just check        # Run code, contract, and registered scaling checks; report note status separately
just hint         # Request one small nudge for blank or partial work
just review       # Review queued work; optionally pass a lesson id
just solution     # Explicitly reveal a reference without replacing your code
```

For every lesson:

1. Read `instructions.md`.
2. Implement the focused TODO in `solutions/typescript/solution.ts`.
3. Run `just check`.
4. Use the failure category or `just hint` to make the next small adjustment.
5. Explain the contract, approach, correctness, and complexity in `analysis.md` using your own words.
6. Run `just check`; after code verification passes, Codex reads the analysis and solution together and returns an analysis pass or fail with feedback.

`check` always runs deterministic code verification first. Its `PASS` and `FAIL` refer to types, correctness, edge cases, input contracts, complexity-sensitive behavior, and runtime execution. Once code passes, the CLI sends the analysis and submitted solution to an isolated `codex exec` process. Codex returns `ANALYSIS PASS` or `ANALYSIS FAIL` plus feedback. It evaluates the meaning of the explanation instead of requiring specific headings, keywords, connector words, or exact phrasing. The lesson advances only when both verdicts pass.

Existing work that uses the former seven-section analysis template remains valid; it is read as the same three compact note groups. New untouched lessons use the shorter template.

## Coaching configuration

External coaching is controlled solely by the presence of a supported provider:

```dotenv
# Empty means no external process; static hints still work.
COACH_PROVIDER=

# A nonempty supported value enables it.
COACH_PROVIDER=codex
```

Unsupported values fail immediately with a configuration error. There is no second boolean flag.

This setting controls optional hints, diagnoses, and detailed rubric reviews. The analysis assessment performed by `just check` always uses the locally authenticated Codex CLI because its verdict controls lesson progression.

With Codex configured:

- `just hint` sends the current partial attempt for a concrete hint that doubles in directness across repeated requests until capped.
- Every failed check requests a diagnosis, with guidance increasing exponentially on consecutive attempts until capped.
- `just review` requests advisory rubric feedback about correctness, complexity, clarity, and communication.
- Codex runs read-only and ephemerally from an empty generated directory, receives an allowlisted environment, returns a constrained structured response, and cannot overwrite your code.
- Invalid or unavailable external feedback falls back without changing deterministic pass/fail results.

Read [docs/coaching.md](docs/coaching.md) for data flow, response contracts, troubleshooting, and adding another provider.

## Timing

Timing is an optional persisted stopwatch, never a process deadline. Merely running `status` does not start it. Correct work never fails because it took longer than a target.

```dotenv
# off | checkpoints | all
WORKSHOP_TIMER_MODE=checkpoints

# Optional global positive-minute override. Empty uses each lesson's target.
WORKSHOP_TIMER_MINUTES=
```

```bash
just timer status
just timer start
just timer pause
just timer resume
just timer reset
```

Read [docs/timer.md](docs/timer.md) before your first timed checkpoint. It documents exactly when time accumulates, survives terminal closure, stops, resets, and appears in readiness feedback.

## Progress and reset behavior

Generated state lives under `.workshop/` and is ignored by Git. It contains:

- Verification, concise-analysis, pass, and attempt history
- Hint and successful-diagnosis counts plus coaching reports
- Stopwatch segments
- Explicitly revealed reference solutions

`just reset` removes that generated state only. It never rewrites `analysis.md`, `solution.ts`, tests, or any other learner-authored file. Use Git if you intentionally want to restore starter code.

When all lessons pass, `just status` becomes the final readiness assessment. “Unassisted” means zero hints, zero successful adaptive diagnoses, and no solution reveal. The report shows those assistance counts, attempts, completed duration versus target, analysis-note status, optional coach scores, outstanding revealed-solution reviews, and whether the agreed readiness target is met. Time remains evidence rather than a pass/fail gate.

## Curriculum

| Lessons | Focus                                                            |
| ------- | ---------------------------------------------------------------- |
| 1–5     | Cost model, baselines, hash maps, frequency maps, two pointers   |
| 6       | First mixed retrieval checkpoint                                 |
| 7–10    | Sliding windows, stacks, and linked lists                        |
| 11      | Second mixed retrieval checkpoint                                |
| 12–15   | Fast/slow pointers, binary search, boundary search, backtracking |
| 16      | Third mixed retrieval checkpoint                                 |
| 17–20   | Tree DFS/BFS, queues, heaps, and intervals                       |
| 21      | Fourth mixed retrieval checkpoint                                |
| 22–23   | Graph traversal and introductory dynamic programming             |
| 24      | Two-part, unannounced final interview simulation                 |

Concepts return under different surface stories. Checkpoint lesson manifests intentionally use generic skill labels so the relevant pattern is not announced.

## Supplemental practice catalog

After or alongside the progressive curriculum, use the validated 96-question catalog for grouped
transfer practice without changing lesson progression:

```bash
just practice groups
just practice learn graph-search
just practice                 # Readiness-aware blind prompt
just practice start graph-01  # Record an attempt
just practice hint graph-01 1
just practice done graph-01 4 # Complete with confidence 4/5
just practice map graph-search
just practice reveal prefix-03
```

`learn` is optional; blind prompts hide concept metadata until `hint` or `reveal`. Supplemental
attempts and confidence are stored separately from core progression. See
[practice/README.md](practice/README.md) for the catalog structure and the evaluation of accepted,
adapted, and deferred proposals.

## Reference-solution policy

Complete solutions are not present as readable source in the ordinary lesson path. The packaged reference bundle is integrity-checked and materialized only when you explicitly run `just solution`. It appears under `.workshop/revealed/<lesson>/` and never overwrites your attempt.

Revealing a solution marks the lesson as review-required. You can still pass it, but `just status` keeps it in the review queue. With optional coaching configured, a successful structured review clears the marker. Otherwise, first earn a passing Codex analysis verdict and then run `just review <lesson-id>` to record the review without inventing rubric scores.

## Maintainer verification

```bash
just typecheck
just lint
just format-check
just test
pnpm validate:references
```

`just test` exercises runner foundation behavior against the untouched TODO state. `validate:references` decodes every reference into a disposable generated workspace, type-checks it, and runs its visible and internal verifier through an explicit source override. It never writes to learner solution paths and removes the generated workspace afterward. It is intended for workshop maintenance, not normal study.

See [docs/architecture.md](docs/architecture.md) for runner boundaries and [docs/interview-process.md](docs/interview-process.md) for the communication rubric.
