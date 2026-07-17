export function pairSumBaseline(nums: number[], target: number): [number, number] | null {
  // pairSumBaseline([2, 7, 11], 9) -> [0, 1]
  // if we cannot rub 2 numbers together, it must be null
  if (nums.length <2) return null

  let result: [number,number] | null = null
  for (let i = 0; i < nums.length; i++) {
    const baseline = nums[i]
    for(let secondIndex = i + 1; secondIndex < nums.length; secondIndex++) {
      const localTarget = nums[secondIndex]
      if(baseline === undefined || localTarget === undefined) {
        throw new Error(`Unexpected undefined: secondIndex: ${secondIndex} - localTarget: ${localTarget}`)
      }
      const localResult = baseline + localTarget
      if (localResult === target) {
        result = [i, secondIndex]
        break
      }

    }
    if (result !== null) break
  }
  return result
  // Describe the finite search space of distinct index pairs before coding.
  // Avoid checking an index with itself or checking mirrored pairs twice.
  // Explain why exhausting that search space proves there is no solution.
}
