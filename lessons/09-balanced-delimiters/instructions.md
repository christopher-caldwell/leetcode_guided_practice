# 09. Validate Nested Delimiters

## Interview skill being developed

stacks, last-in-first-out reasoning, local invariants. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Arrays and basic iteration.

## Problem statement

Return true when (), [], and {} delimiters are correctly paired and nested. The input contains only delimiter characters. An empty string is valid.

### Examples

- `hasBalancedDelimiters('([])') -> true`
- `hasBalancedDelimiters('([)]') -> false`

### Constraints

- 0 <= input.length <= 100,000
- Input contains only ()[]{} characters.

## Contract checks

- Is an empty string valid?
- Does matching count suffice, or must nesting order match?
- Can a closing delimiter appear before an opener?

These are prompts, not required individual answers. In `lessons/09-balanced-delimiters/learner_analysis.md`, record only a contract detail that affected your implementation.

## Expected workflow

1. Read the contract and choose one representative edge case.
2. Implement inside the TODO boundary.
3. Run `just check`; PASS or FAIL reflects code verification only.
4. Explain the solution in `learner_analysis.md`; after code passes, the configured AI provider evaluates the lesson contract, analysis, and solution. Without one, reasoning remains self-assessed.

## Editable files and TODO boundary

- Reasoning: `lessons/09-balanced-delimiters/learner_analysis.md`
- Implementation: `lessons/09-balanced-delimiters/solutions/typescript/learner_solution.ts`
- Visible examples: `lessons/09-balanced-delimiters/solutions/typescript/public.test.ts`

Edit `learner_analysis.md` and the TODO implementation in `learner_solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Check and progression

`just check` always runs the TypeScript and registered lesson verifiers first. Their PASS or FAIL reflects code verification. With a configured AI provider, the agent then returns a separate analysis PASS or FAIL with feedback. It judges meaning rather than exact headings, keywords, or phrasing, and minor issues must still pass. The lesson advances when both verdicts pass. Without AI feedback, the deterministic verdict alone advances.

## Common traps

- Counting delimiter types without preserving nesting order.
- Reading from an empty stack.
- Forgetting unmatched opening delimiters at the end.

## Optional follow-up

After the lesson advances, consider this variation:

> How would the contract change if ordinary text characters should be ignored?

Do not code the variation unless you want extra practice.
