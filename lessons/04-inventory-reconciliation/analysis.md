# Analysis: Reconcile Two Inventories

Keep these notes short enough to say aloud in an interview. Three compact entries are enough.

## Contract

first step is to check length. If they are different lengths, they cannot be the same inventory

<!-- TODO: Record only a contract detail or edge case that affected your implementation. -->

## Approach

After handling the edge case, we go through 1st list, and record the first occurrence. On duplicates, increment the seen count. Map<string, number> = letter, num times seen

Unsure about the comparison.. One option is to do one loop, and construct the same map. The order will be different, but the counts will be the same

From there, a final calculation is needed iterating over one map, while using the lookup of the other. THat is 3 loops. I will try that first, and see if it can be optimized after.

Opportunity for optimization lies in the checking. There is likely some trick to only doing 2 iterations. I have tried to get it down to 2 loops by using the first map to check the second list as we go, but I don't see a practical way to handle duplicates. 

I have tried a few different ideas and do not see a way to avoid the final loop.


<!-- TODO: Describe the algorithm directly in two to four sentences. Mention a baseline only when it is genuinely different. -->

## Correctness and complexity

I am not 100% on this one. My first instinct is that it's time is O(n). N is both arrays + the uniqueness map. The time will grow linearly with the arrays, and the map will be dependent on the array composition, not their length.

For space, I believe O(n), where n is the number of unique entries between both arrays to create the space for the map, which is as stated, dependent on the compoisiton of the content strings, not the length.

<!-- TODO: Give one reason the result is correct, then state explicit Big-O time and auxiliary-space bounds. -->
