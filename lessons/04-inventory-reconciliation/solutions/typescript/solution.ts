// I tried to optimize down to 2 loops, but I don't see a practical way of doing so. This is incomplete, and should only be viewed from a "what did you try when optimizing" lens.
export function sameInventoryOptimized(first: string[], second: string[]): boolean {
  // Write down which observable facts must match even though order does not.
  // Decide what one Map entry means and how it changes while inputs are processed.
  // Preserve both inputs and justify any early-return conditions.

  // first step is to check length. If they are different lengths, they cannot be the same inventory
  // next, go through 1st, and record the first occurrence. On duplicates, increment the seen count. Map<string, number> = letter, num times seen
  // Unsure about the comparison.. One option is to do one loop, and construct the same map. The order will be different, but the counts will be the same
  // From there, a final calculation is needed iterating over one map, while using the lookup of the other. THat is 3 loops. I will try that first, and see if it can be optimized after.
  // Opportunity for optimization lies in the checking. THere is likely some trick to only doing 2 iterations.

  const seenMapBase = buildSeenMap(first)
  const seenMapTarget = new Map<string, number>()
  let isPresentInBoth = true
  for (const str of second) {
    const hasBeenSeenCount = seenMapBase.get(str)
    if (hasBeenSeenCount === undefined) {
      // A get should ALWAYS hit from the base, regardless of order and count
      isPresentInBoth = false
      break
    } else {
      const prevCount = seenMapTarget.get(str)!
      // has already been seen, need to increment count
      seenMapTarget.set(str, prevCount + 1)

      // This is kind of a shot in the dark. My guess is that if I overwrite the var every time.. No that wont work. If the last one happens to be the same count, it will falsely report true.
      if(prevCount + 1 === hasBeenSeenCount) {
        isPresentInBoth = true
      } else {
        isPresentInBoth = false

      }

    }
  }
  return isPresentInBoth
}

// THis is my first attempt, before attempting optimizing
export function sameInventory(first: string[], second: string[]): boolean {
  // Write down which observable facts must match even though order does not.
  // Decide what one Map entry means and how it changes while inputs are processed.
  // Preserve both inputs and justify any early-return conditions.

  // first step is to check length. If they are different lengths, they cannot be the same inventory
  // next, go through 1st, and record the first occurrence. On duplicates, increment the seen count. Map<string, number> = letter, num times seen
  // Unsure about the comparison.. One option is to do one loop, and construct the same map. The order will be different, but the counts will be the same
  // From there, a final calculation is needed iterating over one map, while using the lookup of the other. THat is 3 loops. I will try that first, and see if it can be optimized after.
  // Opportunity for optimization lies in the checking. THere is likely some trick to only doing 2 iterations.

  if(first.length !== second.length) {
    return false
  }

  const seenMapBase = buildSeenMap(first)
  const seenMapTarget = buildSeenMap(second)
  let isSameInventory = true
  for (const [str, count] of seenMapBase) {
    const targetCount = seenMapTarget.get(str)
    if(targetCount !== count) {
      isSameInventory = false
      break
    }
  }
  return isSameInventory

}

const buildSeenMap = (stringArr: string[]): Map<string, number> => {
  const seenMap = new Map<string, number>()
  stringArr.forEach(str => {
    const hasBeenSeenCount = seenMap.get(str)
    if (hasBeenSeenCount === undefined) {
      // Has not been seen, need to record for the first time
      seenMap.set(str, 1)
    } else {
      // has already been seen, need to increment count
      seenMap.set(str, hasBeenSeenCount + 1)
    }
  })
  return seenMap
}
