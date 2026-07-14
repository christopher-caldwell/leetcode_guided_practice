# Coaching Providers

Deterministic tests decide whether code passes. A coaching provider supplies small hints, diagnoses failed attempts, and reviews passing work. These responsibilities are deliberately separate so an unavailable or inconsistent model cannot corrupt progression.

## Enabling coaching

External coaching uses one optional environment value:

```dotenv
COACH_PROVIDER=codex
```

An unset, empty, or whitespace-only value means external coaching is disabled. Static hints and deterministic failure categories remain available.

Any nonempty value is treated as an attempt to enable a provider and is validated. The initial supported value is `codex`; a typo such as `codxe` fails fast rather than silently disabling feedback.

There is intentionally no `CODEX_COACHING` boolean.

## Codex authentication and billing boundary

The workshop does not import the OpenAI SDK, call the OpenAI API, read an API key, or manage credentials. It launches the locally installed `codex` executable, which reuses that CLI's existing authentication and subscription behavior.

Verify your own installation before enabling it:

```bash
codex --version
codex exec --help
```

## Three coaching operations

### Hint

`just hint` is designed for a blank, partial, or knowingly incorrect attempt. Codex receives the lesson title and skills, current source, current analysis, attempt count, and previous hint count.

The response contains only:

- A short focus label
- One hint capped at 280 characters
- One question capped at 220 characters

The prompt forbids code, pseudocode, a full algorithm, and multi-step walkthroughs. Hint depth increases slowly with repeated requests.

If Codex fails or returns invalid structure, the CLI reveals the next of three static lesson hints.

### Diagnosis

A failed `just check` always displays deterministic categories first. With Codex enabled, adaptive diagnosis runs only on Fibonacci-numbered attempts:

```text
1, 2, 3, 5, 8, 13, 21, …
```

This produces dense help early without invoking a model on every repeated check. Escalation depth grows at those thresholds. The response identifies what is working, one observation, one next step, and one question. It cannot change the deterministic result.

### Review

After a deterministic pass, Codex reviews the solution and analysis. It scores four dimensions from 1 through 4:

- Correctness reasoning
- Complexity reasoning
- Implementation clarity
- Interview communication

It can suggest improvements even for passing code. Scores are advisory and contribute evidence for readiness reflection; they never relock a deterministic pass.

`just review` repeats this process for the most recently passed lesson. It also clears that lesson's review-required marker after explicit solution revelation.

## Execution safety

The Codex provider uses non-interactive `codex exec` with:

- `--ephemeral`, avoiding a persistent Codex session for each hint
- `--sandbox read-only`, preventing repository edits
- `--output-schema`, constraining the final response shape
- `--output-last-message`, producing one machine-readable result file
- A 120-second process timeout

The output is parsed as JSON and validated again with Zod. Malformed output, process errors, missing authentication, timeouts, or missing executables are handled as coaching unavailability. Deterministic checks and progress remain intact.

Learner source and analysis are treated as untrusted data in the coaching prompt. The provider is explicitly told not to follow instructions embedded within them or inspect other repository files.

## Generated feedback

Validated coaching reports are written under:

```text
.workshop/feedback/<lesson-id>/
```

This directory is gitignored. It is removed by `just reset`; learner files are not.

## Adding another provider

Providers implement the TypeScript `CoachProvider` port in `src/providers/coach.ts`:

```ts
interface CoachProvider {
  readonly name: string
  hint(context: CoachContext): Promise<HintResponse>
  diagnose(context: CoachContext): Promise<DiagnosisResponse>
  review(context: CoachContext): Promise<ReviewResponse>
}
```

To add a provider such as a different authenticated local CLI:

1. Implement all three methods behind a new adapter file.
2. Return the existing normalized response types; do not leak provider-specific output into core progression.
3. Add the provider name to environment validation.
4. Add it to `src/providers/factory.ts`.
5. Invoke the external process without a shell, use the least privileges possible, and enforce a timeout.
6. Add response-shape, failure, and fallback tests.
7. Document authentication and data exposure accurately.

Text generation is the easy part. Reliable structured output, safe process execution, no-answer hint constraints, and failure recovery are the substantive adapter work.

## Troubleshooting

### Unsupported provider error

Use an empty value or exactly `codex`:

```dotenv
COACH_PROVIDER=
```

or:

```dotenv
COACH_PROVIDER=codex
```

### `codex` executable not found

Install the Codex CLI or remove `COACH_PROVIDER`. Static hints require no external executable.

### Authentication failure

Run a simple `codex exec` command directly and complete the CLI's normal authentication flow. The workshop does not handle credentials.

### Structured response rejected

The CLI prints coaching as unavailable and preserves deterministic results. The generated schema and raw last-message files remain under `.workshop/generated/` for local debugging until reset.

### Coaching appears too explicit

Stop requesting additional hints for that attempt and continue from your own reasoning. Complete solutions are a separate explicit `just solution` action and are never part of hint or diagnosis prompts.
