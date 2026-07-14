# Repository guidance

- Use Node.js 22+, pnpm, TypeScript, Vitest, Zod, and the root Justfile.
- Run `just typecheck`, `just lint`, `just format-check`, and `just test` after runner changes.
- Run `pnpm validate:references` after changing a lesson contract, verifier, support type, or packaged reference.
- Preserve learner-authored `lessons/*/analysis.md` and `lessons/*/solutions/*/solution.*` unless the user explicitly asks to change an exercise.
- Never copy complete reference implementations into the ordinary lesson path. `just solution` is the only normal reveal path.
- Coaching providers may advise but must not mutate learner files or control deterministic progression.
- `just reset` must remain unable to overwrite learner files.
