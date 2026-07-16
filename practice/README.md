# Supplemental Practice Catalog

This bank extends the 24 progressive lessons without changing their unlock order or readiness
assessment. It contains 96 prompts: six in each of sixteen concept groups. Catalog entries are
validated metadata, not additional graded lessons, so they do not require references and cannot
block workshop progress.

## Practice workflow

Choose either path before an attempt.

Learn first with a short concept explanation and a vetted video lesson or worked example:

```bash
just practice learn prefix-state
```

Or go in blind. The default command samples only incomplete problems whose mapped core lessons you
have already passed:

```bash
just practice
```

Record an attempt, request one of three graduated hints only if needed, and mark the result with a
confidence score:

```bash
just practice start prefix-03
just practice check prefix-03
just practice hint prefix-03 1
just practice hint prefix-03 2
just practice done prefix-03 4
just practice progress prefix-state
```

`start` creates `practice/attempts/<id>/analysis.md` and `solution.ts` once, then preserves everything
you write there on later starts and resets. `check` type-checks that workspace against the displayed
contract; completion remains self-assessed because supplemental prompts do not yet have 96 packaged
reference implementations and deterministic verifiers.

Practice history lives in `.workshop/practice-progress.json`. It is separate from lesson pass state,
and `just reset` clears that generated history without deleting learner-authored practice work.

You can also browse IDs, inspect lesson mappings, select a prompt, or deliberately bypass readiness
gating with an unrestricted deterministic sample:

```bash
just practice groups
just practice list prefix-state
just practice map prefix-state
just practice show prefix-03
just practice sample prefix-state week-2-session-1
```

Every blind prompt includes an exact TypeScript function signature from
[contracts.json](contracts.json), so tree, graph, nullable-result, tuple, and bigint contracts do not
need to be inferred from prose.

After writing and discussing an approach, reveal the intended concept, expected complexity, edge
cases, recognition signals, common wrong approaches, and its relationship to core lessons:

```bash
just practice reveal prefix-03
```

The original batch lives in [catalog.json](catalog.json), and later batches are separate files under
`catalogs/` so the bank can continue growing without one unmanageable source file. Every entry
includes the proposed metadata: `id`, `title`, `primary_concept`, `secondary_concepts`, `difficulty`,
`statement`, `constraints`, `expected_complexity`, `answer_type`, `generator_parameters`, and
`edge_cases`.

[core-lessons.json](core-lessons.json) maps every practice problem to one or more of the 24 core
lessons. A connection is labeled `foundation`, `reinforces`, `extends`, or `combines`, and explains
the relationship. `just practice map [group]` shows the compact map; `reveal` includes the full
explanation. The mappings cover every core lesson at least once.

[concepts.json](concepts.json) contains the optional learn-first blurbs, curated resources, suggested
core position, and three-level hint ladder for every group. These fields are kept out of `show`,
`ready`, and `start` output so blind practice remains genuinely blind.

## Core-extension batch

The second batch adds six questions in each area that was underrepresented in the original bank:

| Group                                    | Core lesson anchors |
| ---------------------------------------- | ------------------- |
| Two pointers and sliding windows         | 5, 7, 8, 10, 11     |
| Stacks and monotonic structures          | 7, 9                |
| Linked-list pointers                     | 10, 12              |
| Binary-search variants                   | 13, 14, 16          |
| Recursion and backtracking               | 15, 22              |
| Tree traversal                           | 3, 17, 18           |
| Heaps and streaming selection            | 4, 10, 19, 21       |
| Graph search and connectivity            | 18, 19, 22, 24      |
| Dynamic programming and greedy decisions | 13, 20, 23          |

These problems deliberately include both direct reinforcement and extensions. For example, the
monotonic-stack exercises begin from lesson 9's LIFO reasoning, while weighted graph routes extend
the unweighted shortest-path work in lesson 24.

## Evaluation of the submitted catalog

The proposals are broadly strong. They are especially useful as transfer practice because they
change the output contract and structural twist while revisiting a known operation. They should not
all become sequential lessons: doing so would dilute the workshop's checkpoint and final-readiness
design and would turn lightweight variants into mandatory progression gates.

### Added

Six exercises from every group were selected for breadth, interview frequency, and a contract that
can be made deterministic without excessive domain machinery:

| Group                      | Added source proposals  |
| -------------------------- | ----------------------- |
| Set membership             | A1, A3, A4, A5, A6, A8  |
| Frequency maps             | B1, B2, B5, B6, B8, B10 |
| Complement lookup          | C2, C3, C4, C5, C7, C8  |
| Canonical representation   | D1, D2, D4, D5, D7, D9  |
| Prefix state               | E1, E2, E3, E4, E5, E11 |
| Difference and sweeps      | F1, F3, F4, F5, F7, F8  |
| Index placement and cycles | G1, G3, G4, G5, G6, G8  |

Several needed contract repairs before inclusion:

- D4 now treats opposite vectors as different directed rays and rejects the zero vector.
- F4 uses inclusive integer intervals, so a boundary event occurs at `right + 1`.
- F5 uses half-open sessions and returns every maximal peak interval. That makes it a real variant
  of lesson 21 rather than a renamed copy.
- F7 requires bigint coordinates and totals because its proposed `10^18` bound is not a safe
  JavaScript number.
- G8 defines `-1` as the acyclic exit and specifies all four result fields.
- Output ordering and tie-breaking are explicit wherever multiple correct arrays or index pairs
  would otherwise make deterministic verification ambiguous.

### Not added in this pass

These remain reasonable future variants, but they add less value than the selected set or need a
more substantial contract decision:

| Proposals                            | Reason                                                                                                                                                    |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A2 boolean form, C1 any-pair form    | Exact duplicates of core lessons 6 and 2/3. Their richer result variants could be separate prompts later.                                                 |
| E9                                   | Exact `k = 0` specialization of added proposal E2.                                                                                                        |
| A7, B3, C6, C10, D8, E8, F2, G2, G7  | Sound but close to a selected exercise with a smaller or mostly cosmetic transfer step.                                                                   |
| B4, D3                               | Text and contact normalization need a precise configurable policy before examples and tests can be authoritative.                                         |
| B7, B9, C9, D6, D10, E6, E7, E10, F6 | Valuable second-batch material, but they introduce another major technique, representation, parser, or numeric contract beyond the group's primary focus. |
| E12                                  | The requested result is ambiguous, and its explanation describes repeated prefixes while its title suggests a different statistic.                        |

The omitted items are not rejected wholesale. A future expansion should favor the advanced items
above after adding executable starter files and verifiers, rather than adding more near-identical
easy variants.
