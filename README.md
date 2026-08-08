# Algorithm Interview Workshop

This is a follow-along TypeScript workshop for an experienced application engineer who is new to LeetCode-style algorithm interviews. It teaches a repeatable reasoning process: clarify the contract, establish a correct baseline, identify the costly operation, derive an optimization, prove it, and communicate complexity.

The project contains 24 progressively checked lessons. The CLI tracks local progress and always tells you which instruction, analysis, and source files to open next.

## Requirements

- Node.js 22 or newer
- pnpm 10 or newer
- [just](https://github.com/casey/just)
- Optional: an installed and authenticated Codex CLI or Claude Code CLI for AI feedback

No direct model API integration is used. AI feedback invokes the selected locally authenticated CLI.
Claude support is experimental. Fresh supplemental-practice generation currently remains a separate,
explicit Codex CLI operation.

## Start here

```bash
cp .env.example .env
just bootstrap
just status
```

Then open the three paths printed by `just status`. For lesson 1 these are:

- `lessons/01-linear-scan/instructions.md`
- `lessons/01-linear-scan/learner_analysis.md`
- `lessons/01-linear-scan/solutions/typescript/learner_solution.ts`

`just bootstrap` creates each ignored learner file from the clean tracked starter beside it. It
only creates missing files, so running it again never overwrites your work.

Run your first check with:

```bash
just check
```

Starter solutions intentionally fail their registered code checks. With no AI provider, passing those
checks advances the lesson and the interview explanation remains self-assessed. With Codex or Claude
configured, the selected agent also returns a structured semantic analysis verdict.

## Daily workflow

```bash
just status       # See the current lesson and exact files to open
just start        # Print those files and deliberately start timing when applicable
just check        # Run deterministic checks, then optional structured AI assessment
just hint         # Request one small nudge for blank or partial work
just review       # Review queued work; optionally pass a lesson id
just solution     # Explicitly reveal a reference without replacing your code
```

For every lesson:

1. Read `instructions.md`.
2. Implement the focused TODO in `solutions/typescript/learner_solution.ts`.
3. Run `just check`.
4. Use the failure category or `just hint` to make the next small adjustment.
5. Explain the contract, approach, correctness, and complexity in `learner_analysis.md` using your own words.
6. Run `just check`; after code verification passes, the configured agent reads the lesson contract,
   analysis, and solution together and returns an analysis pass or fail with feedback. Without an
   agent, deterministic verification advances the lesson.

`check` always runs deterministic code verification first. Its `PASS` and `FAIL` refer to types,
correctness, edge cases, input contracts, complexity-sensitive behavior, and runtime execution. When
AI feedback is enabled, the selected CLI returns `ANALYSIS PASS` or `ANALYSIS FAIL` plus feedback.
The agent evaluates meaning rather than headings, keywords, connector words, or exact phrasing; minor
imprecision and optional improvements must still pass. An AI failure can pause progression only when
a supported provider is explicitly configured.

All untouched lessons use the same short three-part analysis template. Existing work using an older,
longer format remains valid because agent assessment is semantic rather than template-based.

## Coaching configuration

AI feedback is controlled solely by the selected provider:

```dotenv
# Empty means deterministic checks and static hints only.
COACH_PROVIDER=

# Stable provider.
COACH_PROVIDER=codex

# Experimental provider.
COACH_PROVIDER=claude
```

Values are trimmed and case-insensitive. Any value other than `codex` or `claude` behaves like an
empty value: no AI process runs, deterministic checks alone control progression, and static hints
remain available. There is no second boolean flag.

This one setting controls hints, failed-attempt diagnoses, detailed rubric reviews, and the semantic
analysis assessment after code passes. If a selected CLI is unavailable or returns invalid structured
output, deterministic verification is retained and the lesson waits for a later assessment. Clear or
change `COACH_PROVIDER` if you want deterministic-only progression.

With a supported provider configured:

- `just hint` sends the current partial attempt for a concrete hint that doubles in directness across repeated requests until capped.
- Every failed check requests a diagnosis, with guidance increasing exponentially on consecutive attempts until capped.
- `just review` requests advisory rubric feedback about correctness, complexity, clarity, and communication.
- The agent runs non-interactively from an empty generated directory with tools disabled or read-only,
  receives an allowlisted environment, returns a schema-validated response, and cannot overwrite your code.
- Hint and diagnosis failures fall back safely; assessment failures retain the deterministic result.

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

- Verification, optional AI-analysis, pass, and attempt history
- Hint and successful-diagnosis counts plus coaching reports
- Stopwatch segments
- Explicitly revealed reference solutions

`just reset` removes that generated state only. It never rewrites `learner_analysis.md`,
`learner_solution.ts`, tests, or any other learner-authored file. To start an exercise over,
delete only its learner file and rerun `just bootstrap`; the tracked starter is never changed.

Curriculum learner files are ignored so a normal clone starts clean even after the repository
owner has practiced. If you fork the workshop and want Git history for your own attempts, remove
the two `/lessons/*/.../learner_*` rules from `.gitignore` (or add selected files with `git add -f`).
This affects the current working tree; old solutions already present in earlier Git commits remain
available in repository history.

When all lessons pass, `just status` becomes the final readiness assessment. “Unassisted” means zero
hints, zero successful adaptive diagnoses, and no solution reveal. The report shows those assistance
counts, attempts, completed duration versus target, reasoning-assessment status, optional coach scores,
and outstanding revealed-solution reviews. Assistance, time, and scores are evidence rather than
pass/fail gates; completing the curriculum and clearing revealed-solution review debt meets the target.

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

After or alongside the progressive curriculum, use the validated 104-question catalog for grouped
transfer practice without changing lesson progression:

```bash
just practice groups
just practice learn graph-search
just practice                 # Readiness-aware blind prompt
just practice start graph-01  # Record an attempt
just practice fresh focus-04  # Ask Codex for a new presentation and numbered workspace
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

Complete solutions are not present in the tracked lesson starters. The packaged reference bundle is
integrity-checked and materialized only when you explicitly run `just solution`. It appears under
`.workshop/revealed/<lesson>/` and never overwrites your ignored learner attempt.

Revealing a solution marks the lesson as review-required. You can still pass it, but `just status`
keeps it in the review queue. With AI feedback configured, a successful structured review clears the
marker. Otherwise, after deterministic verification, `just review <lesson-id>` records a self-assessed
review without inventing rubric scores.

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
