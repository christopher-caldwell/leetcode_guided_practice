# Analysis: Pair Sum at Scale

Keep these notes short enough to say aloud in an interview. Three compact entries are enough.

## Contract
The first value seen cannot be computed, as there's nothing to compare to. So we store it outright, and continue.

An edge case that might impact the mechanical checking of the answer is if there are duplicate entries in the array. If so, this algorithm will pick the most recent occurrence, as indices are overwritten, rather than stored separately. It is possible to target the first the last, or the n-th occurrence, if that was supplied as an argument. We would need to store which index the value occurs on as part of the key. That gets tricky though, and is likely difficult / brittle.
<!-- TODO: Record only a contract detail or edge case that affected your implementation. -->

## Approach
In order to prevent duplicate looping, we store what we have already seen, vs searching for an additional value. This is a tradeoff in more memory used, in order to get a faster / less cycles of compute. 

We store seen values in a hashmap. Skipping the first value, on subsequent values, we subtract the target from the current value at a given index. Since addition is backwards subtraction, we can take the target and subtract the current value. If the result of that is present in the map, we have seen it before, and automatically know it's index position.

<!-- TODO: Describe the algorithm directly in two to four sentences. Mention a baseline only when it is genuinely different. -->

## Correctness and complexity

The time is O(1) at a best case scenario, where the first 2 index positions are the ones we are looking for. ([3, 3], 6) for example. The worst case is O(n), where n is the length of the array, if the targets are the last 2 index positions.

For space, this is should be O(n), as each index position is only visited once, and memory is allocated for both the position in the array, and the storing of the seen values. The memory is deterministic with the length of the array.
<!-- TODO: Give one reason the result is correct, then state explicit Big-O time and auxiliary-space bounds. -->
