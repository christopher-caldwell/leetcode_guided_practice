# Timer Guide

The workshop timer is a persisted stopwatch for observing interview pace. It is not a countdown process, enforcement mechanism, or correctness criterion.

## What timing measures

The stopwatch measures elapsed wall-clock time across explicitly started segments for one lesson. It is intended to include the work you would perform in an interview:

- Clarifying and restating the problem
- Producing examples
- Describing a baseline
- Deriving and explaining an optimization
- Coding
- Testing and correcting the attempt

Whether hint time should count is your choice: leave the stopwatch running for an honest coached-session duration, or pause before requesting a learning hint when measuring only independent work. The readiness report separately shows hints, successful adaptive diagnoses, reference revelation, attempts, and completed timing.

## What timing does not do

The timer never:

- Starts because you ran `just status`
- Starts merely because you opened a file
- Terminates a command or editor
- Fails an otherwise correct solution
- Hides feedback after the target is exceeded
- Rewrites or discards work
- Pretends that every lesson should take the same amount of time

Going over target produces an annotation such as `7m 14s over target`. It is evidence for reflection, not a failing test.

## Configuration

Copy `.env.example` to `.env`, then choose a mode:

```dotenv
WORKSHOP_TIMER_MODE=off
```

No lesson is timed. Timer commands explain that timing is disabled.

```dotenv
WORKSHOP_TIMER_MODE=checkpoints
```

Only checkpoint lessons 6, 11, 16, and 21 plus final lesson 24 are timed. This is the recommended learning mode: ordinary instruction remains untimed while retrieval practice records pace.

```dotenv
WORKSHOP_TIMER_MODE=all
```

Every lesson may be timed. This is useful for a later second pass, not recommended while a technique is still new.

Each lesson manifest contains a recommended target. Checkpoints normally use 30–45 minutes and the two-part final uses 75 minutes. Override every active lesson with one positive integer if desired:

```dotenv
WORKSHOP_TIMER_MINUTES=40
```

Leave the value empty to retain lesson-specific targets:

```dotenv
WORKSHOP_TIMER_MINUTES=
```

Configuration is validated when workshop commands begin. `just reset` intentionally bypasses configuration and state parsing so it remains a recovery path for malformed generated data. Values such as `sometimes`, `0`, `-1`, or `forty` fail with a clear error for normal commands.

## Stopwatch lifecycle

The timer for a lesson contains:

- Accumulated milliseconds from completed segments
- An optional wall-clock timestamp for a running segment
- The number of segments started
- The completed duration after successful code verification

It is stored in `.workshop/progress.json` and is therefore preserved between commands and terminal sessions.

### Start deliberately

```bash
just start
```

`start` prints the current instruction, analysis, and source paths. If timing applies, it records the current timestamp. If timing does not apply under the current mode, it opens the workflow without starting a timer.

You can start only the stopwatch with:

```bash
just timer start
```

Starting an already-running timer is idempotent. It reports `already running` and does not create overlapping time.

### Inspect without changing it

```bash
just timer status
```

Status calculates:

```text
stored completed segments + (current time - running segment start)
```

It does not pause, resume, or reset anything.

For `start`, `pause`, `resume`, and `reset`, timer commands always address the current lesson. For `status`, the runner shows the current lesson when it has recorded time; otherwise it shows the most recently recorded lesson. This keeps a just-completed checkpoint visible after progression advances. The selected lesson id is printed with the duration.

### Pause

```bash
just timer pause
```

Pause adds the running segment to accumulated time and clears its start timestamp. Pausing an already-stopped timer is safe and makes no change.

Use pause for a real-world interruption that would not exist in an interview: a phone call, meal, sleep, or unrelated work.

### Resume

```bash
just timer resume
```

Resume starts a new segment while preserving accumulated time. `resume` and `start` have the same state transition; the separate wording makes intent clearer.

### Failed checks

`just check` does not stop a running timer when tests fail. Reading deterministic feedback, correcting code, and rerunning tests are normally part of the measured attempt.

You may explicitly pause after a failure when switching from a timed attempt to untimed study.

### Successful code verification

A `just check` whose code and pre-pass analysis evidence verify automatically stops any timer that has recorded time. This is independent of the current timer mode, so changing `.env` mid-attempt cannot strand a running stopwatch. The completed duration remains visible while you write the required post-pass reflection. External coaching review occurs after deterministic success and after the timer has stopped, so model latency is not counted.

The lesson advances only after the reflection is complete and a subsequent `just check` records it. Reflection time is intentionally outside the interview-attempt stopwatch.

### Reset only the current stopwatch

```bash
just timer reset
```

This clears accumulated time, the running timestamp, segment count, and completed duration for the current lesson. It preserves:

- Attempts
- Pass state
- Hint count
- Coaching reports
- Analysis and source files

If all lessons are complete, mutating timer commands address the final lesson. Status still prefers the most recently recorded timer.

### Reset all generated workshop state

```bash
just reset
```

This removes `.workshop/`, including all timing and progress. It still preserves learner files. Use Git—not reset—if you intend to restore starter implementations.

## Closing the terminal while running

A running timer is based on an ISO wall-clock timestamp, not a resident background process. Closing the terminal, restarting the shell, or rebooting the computer does not pause it. On the next command, all elapsed wall time since the recorded start is included.

If that was accidental:

```bash
just timer reset
```

If you want to keep earlier segments but exclude only part of an accidental interval, the supported behavior is to reset and retime the attempt. Generated state should not be hand-edited unless you understand the schema.

## Changing configuration during an attempt

The current target is derived from the current `.env` each time status is displayed. Changing `WORKSHOP_TIMER_MINUTES` changes the comparison target, not elapsed time.

Changing mode to `off` disables new active timing operations but does not delete stored time. `just timer status` still displays the most recently recorded duration and notes that the current mode is off. Prefer pausing before changing mode; successful code verification will stop a recorded timer even if the mode changed.

## Example: recommended checkpoint flow

```bash
just status
just start
# Clarify, analyze, implement, and test locally.
just check
# If it fails, the clock continues.
just check
# CODE VERIFIED stops the clock automatically.
just timer status
# Complete Post-pass reflection, then record progression.
just check
```

## Example: interrupted attempt

```bash
just start
# Work for 18 minutes.
just timer pause
# Handle an unrelated interruption.
just timer resume
# Continue the same attempt.
just check
```

The final duration is the sum of the two working segments, excluding the paused interval.

## Example: learning mode after a timed failure

```bash
just check
just timer pause
just hint
# Study and revise without adding time.
just timer reset
just timer start
# Begin a fresh independent attempt.
```

Hint usage remains recorded even when the timer is reset.

## Troubleshooting

### Status shows an unexpectedly large duration

The timer was probably left running. Use `just timer reset` for a fresh attempt. Closing the terminal never pauses automatically.

### Timer commands say timing does not apply

Check `WORKSHOP_TIMER_MODE`. In `checkpoints` mode, ordinary lessons are intentionally untimed.

### The target is not the lesson recommendation

A nonempty `WORKSHOP_TIMER_MINUTES` overrides all lesson targets. Empty it to use manifest values.

### A correct check did not record time

The timer never starts implicitly. Run `just start` or `just timer start` before the attempt.

### Codex feedback took time but elapsed duration did not increase

That is intentional. A passing check stops the stopwatch before advisory external review begins, so network and model latency do not affect interview pace.
