set dotenv-load := true

# Install the pinned project dependencies.
bootstrap:
    pnpm install --frozen-lockfile

# Show the current lesson, files, progress, coaching, and timer state.
status:
    pnpm workshop status

# Print the current lesson paths and explicitly start its timer when applicable.
start:
    pnpm workshop start

# Verify the TypeScript solution, then request a semantic Codex analysis verdict.
check:
    pnpm workshop check

# Request one small hint for the current blank or partial attempt.
hint:
    pnpm workshop hint

# Review queued work, or select a verified lesson by id.
review lesson="":
    pnpm workshop review {{ lesson }}

# Explicitly reveal a vetted solution without overwriting learner code.
solution:
    pnpm workshop solution

# Learn, sample, and track supplemental practice without changing core lesson progress.
practice action="ready" target="" seed="":
    pnpm practice {{ action }} {{ target }} {{ seed }}

# Clear generated progress, coaching, and timing state; learner files are preserved.
reset:
    pnpm workshop reset

# Manage the persisted stopwatch: status, start, pause, resume, or reset.
timer action="status":
    pnpm workshop timer {{ action }}

# Run deterministic foundation tests against the untouched learner state.
test:
    pnpm test

# Check TypeScript types without emitting build output.
typecheck:
    pnpm typecheck

# Run static analysis.
lint:
    pnpm lint

# Verify repository formatting without changing files.
format-check:
    pnpm format:check
