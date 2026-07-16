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

## Clarifying questions to consider

- Does order matter?
- Do duplicate counts matter?
- Can unequal lengths ever represent the same inventory?

Write your actual assumptions and answers in `lessons/04-inventory-reconciliation/analysis.md` before coding.

## Expected workflow

1. Restate the contract and walk through a small example.
2. Propose a correct baseline, even if it is too expensive.
3. Define `n` and analyze the baseline's time and auxiliary space.
4. Identify the repeated or expensive operation.
5. Derive an optimization and state its invariant.
6. Implement only inside the TODO boundary.
7. Run `just check`, inspect the failure category, and test your own edge cases.
8. Explain why the final algorithm is correct and state its complexity.

## Editable files and TODO boundary

- Reasoning: `lessons/04-inventory-reconciliation/analysis.md`
- Implementation: `lessons/04-inventory-reconciliation/solutions/typescript/solution.ts`
- Visible examples: `lessons/04-inventory-reconciliation/solutions/typescript/public.test.ts`

Edit `analysis.md` and the TODO implementation in `solution.ts`. Supplied node or priority-queue code is infrastructure, not an exercise.

## Automated pass condition

All required analysis sections must contain your reasoning. The TypeScript project must type-check, public examples and internal deterministic cases must pass, the input contract must be preserved, and any complexity guard for this lesson must pass. Failure output labels the category without dumping internal case details wholesale.

## Common traps

- Treating the arrays as sets and losing multiplicity.
- Sorting despite the no-mutation and linear-time goals.
- Leaving zero-count entries without checking for overuse.

## Post-pass reflection

After CODE VERIFIED, record what observation unlocked the efficient approach, which invariant you would say aloud, and what you would do differently on a fresh problem. Run `just check` again to advance, then consider this variation:

> How would the memory tradeoff change if identifiers came from a fixed alphabet of 26 symbols?

Do not code the variation unless you want extra practice.
