# Analysis: Pair Sum: Establish a Baseline

Keep these notes short enough to say aloud in an interview. Three compact entries are enough.

## Contract
If there are less than 2 items in the array, it must be null as it can't add up to anything.

It shouldn't be possible, but if there is an index lookup miss, we throw an error. Again, shouldn't be possible, but indexing an array should be a safe operation.
<!-- TODO: Record only a contract detail or edge case that affected your implementation. -->

## Approach
In order to find the answer, you must iterate twice. We start with grabbing a baseline number. We then iterate through the rest of the array, excluding the number we captured. We add every other item to the captured item, checking if it matches the target.

If we find a match in the inner loop, we break. If we have a match in the outer loop, we break.
<!-- TODO: Describe the algorithm directly in two to four sentences. Mention a baseline only when it is genuinely different. -->

## Correctness and complexity

This makes this solution Time: O(n²). For every item, we must look at every OTHER item. This is not very fast. Auxiliary space: O(1) because it does not create a data structure that grows with the input.
<!-- TODO: Give one reason the result is correct, then state explicit Big-O time and auxiliary-space bounds. -->
