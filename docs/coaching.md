# AI Feedback Providers

Deterministic tests always decide whether code is correct. AI feedback is optional and controlled by
one environment value:

```dotenv
# codex | claude | empty
COACH_PROVIDER=
```

- `codex` uses an installed and authenticated Codex CLI.
- `claude` uses an installed and authenticated Claude Code CLI. This adapter is experimental.
- Empty, whitespace, or any other value disables AI feedback. Passing deterministic checks then
  advances the lesson, and written reasoning remains self-assessed.

Values are trimmed and case-insensitive. There is intentionally no second enable/disable flag.

## What the provider does

When enabled, the selected provider handles four operations:

- `just hint` returns one bounded hint and one concrete question.
- A failed `just check` may return a diagnosis after deterministic failures are displayed.
- A passing code check requests a semantic pass/fail assessment of the explanation.
- `just review` returns advisory 1–4 scores, strengths, improvements, and one tradeoff.

All responses are constrained by JSON Schema and validated again with Zod. Malformed output,
timeouts, authentication failures, and missing executables cannot change deterministic test results.
If semantic assessment is enabled but unavailable, code verification is retained and progression
waits. Clear or change `COACH_PROVIDER` to continue in deterministic-only mode.

## Fairness boundary

The semantic assessor receives the trusted lesson instructions, the learner analysis, and the
already-verified source. It judges meaning rather than template compliance. It must not require
particular headings, keywords, notation, polished grammar, exhaustive edge cases, or a formal proof.

An explanation passes when it communicates:

- The core algorithm
- A substantially sound reason it works
- Materially accurate time and auxiliary-space costs

Minor imprecision, nonessential omissions, and optional improvements must still pass. Failure is
reserved for a missing key idea, a material error, or a contradiction with the implementation or
lesson contract. A failing response must acknowledge what is sound and identify only the minimum
changes needed.

Detailed 1–4 review scores are advisory. They never override executable checks or the final readiness
target.

## Codex provider

The stable adapter launches `codex exec` with an existing local authentication session. The workshop
does not import the OpenAI SDK, call the OpenAI API directly, or read an OpenAI API key.

Verify the CLI before selecting it:

```bash
codex --version
codex exec --help
```

The process uses `--ephemeral`, a read-only sandbox, a generated JSON schema, a generated output file,
an empty generated working directory, and an allowlisted environment. On macOS, the adapter may retry
the Codex executable bundled with the ChatGPT app if the `codex` command fails.

## Claude provider (experimental)

The experimental adapter launches Claude Code in non-interactive print mode using its existing local
authentication. The workshop does not call the Anthropic API directly or manage Claude credentials.

Verify the CLI before selecting it:

```bash
claude --version
claude --help
```

The adapter requests JSON output validated against an inline JSON Schema, disables tools and slash
commands, disables session persistence and browser integration, supplies an empty MCP configuration,
and runs from the same empty generated working directory used by coaching. Claude Code's CLI and
structured-output envelope may evolve, which is why this provider is explicitly experimental.

If Claude returns a malformed or changed envelope, the command reports feedback as unavailable while
preserving deterministic verification.

## Hint and diagnosis behavior

Hints are useful for blank or partial work. The first request is deliberately small; repeated requests
double in directness until capped. A hint contains only a short focus, a hint of at most 280 characters,
and a question of at most 220 characters. Working code is forbidden.

Failed checks always show deterministic categories first. With AI enabled, diagnosis guidance grows
with consecutive attempts:

```text
attempt 1: 15%   attempt 2: 26%   attempt 3: 43%   attempt 4: 74%   attempt 5+: 100%
```

The diagnosis identifies what is working, one observation, one next experiment, and one question.
It cannot change the deterministic result.

## Review behavior

`just review` selects queued work or the most recently verified lesson. Pass an explicit lesson ID to
select another verified lesson:

```bash
just review 12-cyclic-dependency-chain
```

With a provider, the structured review scores correctness reasoning, complexity reasoning,
implementation clarity, and interview communication from 1–4. Without a provider, an explicit review
records that the learner self-assessed the verified work and clears revealed-solution review debt; no
synthetic score is created.

## Execution and data boundary

Provider processes receive only:

- Trusted lesson title, skills, and instructions
- Current learner source and analysis
- Attempt and hint counts
- Normalized deterministic failures when present

Learner text is labeled untrusted in the prompt. The process receives an allowlist of runtime and
authentication-related environment variables rather than the complete parent environment. Generated
schemas, raw output, and Markdown feedback live under `.workshop/` and are removed by `just reset`.
Learner files are never written by a provider.

## Fresh supplemental-practice generation

`just practice fresh <id>` remains a separate, explicit Codex operation for now. It does not depend on
`COACH_PROVIDER`. The generator preserves the registered TypeScript contract and target technique while
changing the surface story, then writes a numbered workspace only after schema validation succeeds.
Claude feedback support does not yet imply Claude-generated practice variants.

## Adding another provider

Providers implement both ports in `src/providers/coach.ts`: `CoachProvider` for hints, diagnoses, and
reviews, plus `AnalysisEvaluator` for the bounded semantic verdict. A new adapter should reuse the
shared prompts, return the normalized schemas, run without mutation tools, enforce a timeout, pass only
an allowlisted environment, and include malformed-output and unavailable-executable tests.

## Troubleshooting

### No AI feedback appears

Run `just status`. It prints the active provider. Only `codex` and `claude` enable AI; every other value
means deterministic-only mode.

### Executable or authentication failure

Run a minimal non-interactive command directly with the selected CLI and complete its normal login
flow. The workshop does not manage accounts or subscriptions.

### Structured response rejected

The CLI reports feedback as unavailable and preserves deterministic results. Debug artifacts remain
under `.workshop/generated/` until reset.

### Feedback feels too strict

Minor issues should receive a passing verdict with optional improvements. If a provider fails an
otherwise substantively sound explanation, rerun once. If it remains unreasonable, clear
`COACH_PROVIDER` and use deterministic-only progression; the model is a coach, not the authority on
code correctness.
