# 04. Reconcile Two Inventories

## Interview skill being developed

frequency maps, multiset equality, early rejection. This lesson emphasizes explaining why an approach is correct and what operations dominate its cost.

## Prerequisite knowledge

Lesson 3 and TypeScript Map iteration.

## Problem statement

Two arrays contain item identifiers. Return true when they contain exactly the same identifiers with the same multiplicities, regardless of order. Do not sort or mutate either input.

### Examples

- `sameInventory(['a', 'b', 'a'], ['b', 'a', 'a']) -> true`
- `sameInventory(['a', 'a'], ['a']) -> false`

### Constraints

- 0 <= each length <= 100,000
- Identifiers are case-sensitive strings.
- Inputs must remain unchanged.

## Contract checks

- Does order matter?
- Do duplicate counts matter?
- Can unequal lengths ever represent the same inventory?

These are prompts, not required individual answers. In `lessons/04-inventory-reconciliation/learner_analysis.md`, record only a contract detail that affected your implementation.

## Expected workflow

1. Read the contract and choose one representative edge case.
2. Implement inside the TODO boundary.
3. Run `just check`; PASS or FAIL reflects code verification only.
4. Explain the solution in `learner_analysis.md`; after code passes, the configured AI provider evaluates the lesson contract, analysis, and solution. Without one, reasoning remains self-assessed.

## Editable files and TODO boundary

- Reasoning: `lessons/04-inventory-reconciliation/learner_analysis.md`
- Implementation: `lessons/04-inventory-reconciliation/solutions/typescript/learner_solution.ts`
- Visible examples: `lessons/04-inventory-reconciliation/solutions/typescript/public.test.ts`

Edit `learner_analysis.md` and the TODO implementation in `learner_solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Check and progression

`just check` always runs the TypeScript and registered lesson verifiers first. Their PASS or FAIL reflects code verification. With a configured AI provider, the agent then returns a separate analysis PASS or FAIL with feedback. It judges meaning rather than exact headings, keywords, or phrasing, and minor issues must still pass. The lesson advances when both verdicts pass. Without AI feedback, the deterministic verdict alone advances.

## Common traps

- Treating the arrays as sets and losing multiplicity.
- Sorting despite the no-mutation and linear-time goals.
- Leaving zero-count entries without checking for overuse.

## Optional follow-up

After the lesson advances, consider this variation:

> How would the memory tradeoff change if identifiers came from a fixed alphabet of 26 symbols?

Do not code the variation unless you want extra practice.
