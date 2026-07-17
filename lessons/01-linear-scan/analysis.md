## Contract

“First” means the lowest matching index. Empty input or an absent target returns -1, and the input must not be modified.

## Approach

Scan from left to right and return immediately when the target is found. Sorting would cost more and would complicate preserving the original index.

## Correctness and complexity

Before checking index i, every earlier index has already been shown not to match. Therefore, a match at i is the first match; if the scan finishes, the target is absent. Worst-case time is O(n), best-case time is O(1), and auxiliary space is O(1).
