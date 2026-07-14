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

The initial failure is intentional: it identifies the first incomplete reasoning section rather than flooding you with implementation failures.

## Daily workflow

```bash
just status       # See the current lesson and exact files to open
just start        # Print those files and deliberately start timing when applicable
just check        # Validate reasoning, types, correctness, contracts, and scaling
just hint         # Request one small nudge for blank or partial work
just review       # Re-review the most recently passed lesson
just solution     # Explicitly reveal a reference without replacing your code
```

For every lesson:

1. Read `instructions.md`.
2. Replace the prompts in `analysis.md` with concise interview reasoning.
3. Implement the focused TODO in `solutions/typescript/solution.ts`.
4. Run `just check`.
5. Use the failure category or `just hint` to make the next small adjustment.
6. Complete the post-pass reflection before moving on.

`check` runs deterministic validation first. It distinguishes incomplete analysis, TypeScript errors, correctness, edge cases, input-contract violations, complexity-sensitive behavior, and runtime failures.

## Coaching configuration

External coaching is controlled solely by the presence of a supported provider:

```dotenv
# Empty means no external process; static hints still work.
COACH_PROVIDER=

# A nonempty supported value enables it.
COACH_PROVIDER=codex
```

Unsupported values fail immediately with a configuration error. There is no second boolean flag.

With Codex configured:

- `just hint` sends the current partial attempt for one deliberately small nudge.
- Failed checks request diagnosis on attempts 1, 2, 3, 5, 8, 13, and so on.
- Passing checks request advisory feedback about correctness, complexity, clarity, and communication.
- Codex runs read-only and ephemerally, returns a constrained structured response, and cannot overwrite your code.
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

- Pass and attempt history
- Hint counts and coaching reports
- Stopwatch segments
- Explicitly revealed reference solutions

`just reset` removes that generated state only. It never rewrites `analysis.md`, `solution.ts`, tests, or any other learner-authored file. Use Git if you intentionally want to restore starter code.

When all lessons pass, `just status` becomes the final readiness assessment. It reports independent mixed simulations, review evidence when a coach is configured, outstanding revealed-solution reviews, and whether the agreed readiness target is met.

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

## Reference-solution policy

Complete solutions are not present as readable source in the ordinary lesson path. The packaged reference bundle is integrity-checked and materialized only when you explicitly run `just solution`. It appears under `.workshop/revealed/<lesson>/` and never overwrites your attempt.

Revealing a solution marks the lesson as review-required. You can still pass it, but `just status` keeps it in the review queue.

## Maintainer verification

```bash
just typecheck
just lint
just format-check
just test
pnpm validate:references
```

`just test` exercises runner foundation behavior against the untouched TODO state. `validate:references` temporarily installs every reference implementation, runs its visible and internal verifier, and restores all learner files in a `finally` block. It is intended for workshop maintenance, not normal study.

See [docs/architecture.md](docs/architecture.md) for runner boundaries and [docs/interview-process.md](docs/interview-process.md) for the communication rubric.
