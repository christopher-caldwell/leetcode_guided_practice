export function pairSumAtScale(nums: number[], target: number): [number, number] | null {
  // Identify the repeated operation that made the baseline quadratic.
  // Choose retained information that can replace that repeated scan with a lookup.
  // Explain why the order of checking and recording prevents index reuse.
  const numsSeenMap = new Map<number, number>()
  let result: [number, number] | null = null
  for (let i = 0; i < nums.length; i++) {
    const currentValue = nums[i]!
    if (i === 0) {
      // first 3
      numsSeenMap.set(currentValue, i)
      continue
    }
    // second 3 -- 6 - 3 = 3, subResult = 3
    const subResult = target - currentValue
    // ask for 3, get it at 0
    const hasBeenSeenIndex = numsSeenMap.get(subResult)
    if (hasBeenSeenIndex != null) {
      result = [hasBeenSeenIndex, i]
      break
    }
    numsSeenMap.set(currentValue, i)
  }
  return result
}
