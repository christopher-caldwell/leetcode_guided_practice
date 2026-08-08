# Architecture

The project deliberately separates deterministic progression, TypeScript solution verification, external coaching, and packaged references.

```text
Justfile
  -> TypeScript CLI
      -> core lesson/state/timer services
      -> TypeScript verification adapter
      -> optional AI feedback provider
          -> Codex CLI adapter
          -> experimental Claude Code CLI adapter
      -> packaged reference revealer
```

## Lesson boundary

Each lesson is self-contained:

```text
lessons/<id>/
├── lesson.json
├── instructions.md
├── analysis.md                # tracked clean starter
├── learner_analysis.md        # ignored working copy
└── solutions/
    └── typescript/
        ├── solution.ts        # tracked clean starter
        ├── learner_solution.ts # ignored working copy used by the runner
        ├── public.test.ts
        └── support.ts       # only where supplied infrastructure is needed
```

The folder is named `solutions`, so another language can live alongside TypeScript without moving curriculum prose:

```text
solutions/
├── typescript/
└── rust/
```

The runner itself is TypeScript because Node is already required for the initial exercise language. Adding Python solely for orchestration would add a second runtime without improving the learner workflow.

## Deterministic core

`src/core` owns:

- Manifest validation
- Progress serialization
- Stopwatch transitions
- Readiness evidence calculation
- Feedback persistence

It does not decide whether an algorithm is correct.

## TypeScript verification boundary

`src/verification/typescript-adapter.ts` owns TypeScript-specific process execution. It runs:

1. `tsc --noEmit`
2. The lesson's public Vitest file
3. The parameterized internal verifier

Internal test names carry categories such as `[edge-case]` and `[complexity]`. The adapter converts Vitest's JSON report into normalized `CheckFailure` values for the CLI and coach. A small set of lesson-specific TypeScript AST policies covers contracts that black-box output tests cannot establish reliably, such as O(1) auxiliary state or required priority-queue use. Every verifier child has a parent-side deadline and forced-termination fallback.

“Internal” means separate from the visible example file, not secret from a repository owner. Local tests cannot be cryptographically hidden; deterministic generated/scaling cases and known-wrong regression fixtures provide the useful boundary.

A future language implementation should add its own verifier adapter and solution-folder convention while reusing lesson manifests, analysis validation, progress, timers, and coaching requests. The initial release intentionally implements only TypeScript.

## Coaching boundary

`src/providers/coach.ts` defines provider-neutral coaching and analysis-evaluator ports plus their
normalized schemas. `src/providers/codex.ts` is the stable Codex external-process adapter;
`src/providers/claude.ts` is the experimental Claude Code adapter. `src/providers/prompts.ts` keeps
their grading and coaching instructions identical. Provider selection lives in
`src/providers/factory.ts`. Both processes start from an empty generated directory with mutation
tools disabled or read-only and an allowlisted environment rather than inheriting unrelated shell
credentials. With no supported provider, deterministic verification alone advances progression.

This boundary is independent of solution language: a future Rust verifier could still send source, reasoning, and normalized failures through the same coach port.

## Reference boundary

Readable complete solutions are absent from tracked lesson starters and runner source. Ignored
learner files are created locally by `just bootstrap`. `assets/reference-solutions.json` contains
base64-packaged content with SHA-256 integrity hashes. Encoding is not claimed as encryption; its
purpose is to keep solutions out of the ordinary browsing path, not defeat deliberate reverse
engineering.

`just solution` validates and materializes only the current lesson under `.workshop/revealed/`. It also copies supplied support code when necessary and marks the lesson for review.

Maintainer reference validation uses the same verifier with an explicit generated source path. It decodes references into a disposable `.workshop/generated/reference-validation-*` tree and never replaces canonical learner files.

## State boundary

All mutable runner state is under `.workshop/`:

```text
.workshop/
├── progress.json
├── feedback/
├── generated/
└── revealed/
```

No reset operation writes to `lessons/`. Bootstrap only creates missing learner files from tracked
starters; it never overwrites them. Atomic state saves write a temporary file and rename it over
`progress.json`.
