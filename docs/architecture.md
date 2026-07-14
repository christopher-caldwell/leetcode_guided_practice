# Architecture

The project deliberately separates deterministic progression, TypeScript solution verification, external coaching, and packaged references.

```text
Justfile
  -> TypeScript CLI
      -> core lesson/state/timer services
      -> TypeScript verification adapter
      -> optional CoachProvider
          -> Codex CLI adapter
      -> packaged reference revealer
```

## Lesson boundary

Each lesson is self-contained:

```text
lessons/<id>/
├── lesson.json
├── instructions.md
├── analysis.md
└── solutions/
    └── typescript/
        ├── solution.ts
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
- Analysis-section validation
- Stopwatch transitions
- Feedback persistence

It does not decide whether an algorithm is correct.

## TypeScript verification boundary

`src/verification/typescript-adapter.ts` owns TypeScript-specific process execution. It runs:

1. `tsc --noEmit`
2. The lesson's public Vitest file
3. The parameterized internal verifier

Internal test names carry categories such as `[edge-case]` and `[complexity]`. The adapter converts Vitest's JSON report into normalized `CheckFailure` values for the CLI and coach.

A future language implementation should add its own verifier adapter and solution-folder convention while reusing lesson manifests, analysis validation, progress, timers, and coaching requests. The initial release intentionally implements only TypeScript.

## Coaching boundary

`src/providers/coach.ts` defines the provider-neutral port and normalized schemas. `src/providers/codex.ts` is one external-process adapter. Provider selection occurs in `src/providers/factory.ts`.

This boundary is independent of solution language: a future Rust verifier could still send source, reasoning, and normalized failures through the same coach port.

## Reference boundary

Readable complete solutions are absent from lesson directories and runner source. `assets/reference-solutions.json` contains base64-packaged content with SHA-256 integrity hashes. Encoding is not claimed as encryption; its purpose is to keep solutions out of the ordinary browsing path, not defeat deliberate reverse engineering.

`just solution` validates and materializes only the current lesson under `.workshop/revealed/`. It also copies supplied support code when necessary and marks the lesson for review.

## State boundary

All mutable runner state is under `.workshop/`:

```text
.workshop/
├── progress.json
├── feedback/
├── generated/
└── revealed/
```

No reset operation writes to `lessons/`. Atomic state saves write a temporary file and rename it over `progress.json`.
