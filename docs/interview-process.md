# Repeatable Interview Process

Use the same sequence until it becomes automatic. The objective is not to recite pattern names; it is to expose enough reasoning that an interviewer can follow and redirect you.

## 1. Clarify

Confirm the observable contract:

- Input shape and validity
- Output and tie behavior
- Empty or impossible results
- Duplicates and negative values
- Mutation permission
- Expected scale

State reasonable assumptions when an interviewer does not answer.

## 2. Make one example executable by hand

Choose a representative example plus one boundary case. Track indices and data-structure contents rather than waving at the result.

## 3. Establish a correct baseline

Describe the finite search space. A baseline gives you:

- A correctness anchor
- A fallback implementation
- The expensive operation that optimization must remove

Do not apologize for starting with brute force. Do identify when constraints make it insufficient.

## 4. Analyze cost

Define variables before using Big-O. Count how often dominant operations occur and whether they are constant, logarithmic, or linear in the relevant structure.

Separate input storage, output storage, auxiliary storage, and call-stack space.

## 5. Optimize from an operation

Ask what work repeats:

- Repeated search may justify a lookup structure.
- Recomputed overlapping aggregates may justify retained state.
- Ordered input may allow a boundary to discard candidates.
- Nested last-opened work may imply last-in-first-out access.
- Minimum/maximum repeated selection may justify a priority queue.

This is more transferable than guessing a named pattern.

## 6. State an invariant

Say what each index, pointer, map entry, queue item, or recursive return value means. Explain why initialization establishes it, each update preserves it, and termination yields the answer.

## 7. Implement and narrate structure

Name variables after their meaning in the invariant. Handle contract-level edge cases deliberately. Avoid narrating syntax; narrate decisions.

## 8. Test adversarially

Return to:

- Empty and singleton input
- Duplicates
- Negative or zero values
- Answer at either boundary
- Impossible result
- Skewed or disconnected structures
- Mutation constraints

## 9. Close clearly

Restate final worst-case time and auxiliary space. Mention a meaningful alternative tradeoff, not every possible implementation.

## Coaching rubric

Passing code is necessary but not sufficient evidence of readiness. Codex review scores four dimensions from 1–4:

- Correctness: the invariant and termination argument support the result.
- Complexity: variables and dominant operations justify the claimed bounds.
- Clarity: the implementation reflects the explanation and contract.
- Communication: assumptions, baseline, optimization, and tradeoffs are concise and interview-usable.

These scores are advisory because model assessment is nondeterministic. Executable solution checks determine the code verdict. After code passes, Codex reads the learner's analysis and solution together and returns a separate semantic analysis pass or fail with feedback. It is instructed to accept substantively sound explanations despite differences in headings, keywords, notation, grammar, or phrasing, and to fail only materially missing, incorrect, or contradictory reasoning.
