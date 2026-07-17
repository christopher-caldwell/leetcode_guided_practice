export function findFirstIndex(values: number[], target: number): number {
  if (values.length === 0) return -1
  const result = values.findIndex(index => index === target)
  return result

}
