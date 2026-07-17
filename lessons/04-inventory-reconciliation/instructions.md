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

These are prompts, not required individual answers. In `lessons/04-inventory-reconciliation/analysis.md`, record only a contract detail that affected your implementation.

## Expected workflow

1. Read the contract and choose one representative edge case.
2. Implement inside the TODO boundary.
3. Run `just check`; PASS or FAIL reflects code verification only.
4. Explain the solution in `analysis.md`; after code passes, Codex evaluates the analysis and solution together.

## Editable files and TODO boundary

- Reasoning: `lessons/04-inventory-reconciliation/analysis.md`
- Implementation: `lessons/04-inventory-reconciliation/solutions/typescript/solution.ts`
- Visible examples: `lessons/04-inventory-reconciliation/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Check and progression

`just check` always runs the TypeScript and registered lesson verifiers first. Their PASS or FAIL reflects code verification. After code passes, Codex reads the analysis and submitted solution together, returns a separate analysis PASS or FAIL, and provides feedback in either case. It judges the meaning rather than requiring exact headings, keywords, or phrasing. The lesson advances when both verdicts pass.

## Common traps

- Treating the arrays as sets and losing multiplicity.
- Sorting despite the no-mutation and linear-time goals.
- Leaving zero-count entries without checking for overuse.

## Optional follow-up

After the lesson advances, consider this variation:

> How would the memory tradeoff change if identifiers came from a fixed alphabet of 26 symbols?

Do not code the variation unless you want extra practice.
