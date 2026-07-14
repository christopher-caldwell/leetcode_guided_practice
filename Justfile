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

# Validate the current analysis and TypeScript solution.
check:
    pnpm workshop check

# Request one small hint for the current blank or partial attempt.
hint:
    pnpm workshop hint

# Review the most recently passed solution for possible improvements.
review:
    pnpm workshop review

# Explicitly reveal a vetted solution without overwriting learner code.
solution:
    pnpm workshop solution

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
