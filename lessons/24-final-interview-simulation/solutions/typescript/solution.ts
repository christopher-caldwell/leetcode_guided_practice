export type Edge = [number, number]

export function smallestCoveringRange(
  events: string[],
  required: string[],
): [number, number] | null {
  // Derive the validity condition without relying on a pattern label.
  // Preserve multiplicity and define when a valid candidate can safely contract.
  // State the tie behavior you infer from the examples and contract.
  void events
  void required
  throw new Error('TODO: complete final simulation part A')
}

export function shortestRoute(
  serviceCount: number,
  edges: Edge[],
  start: number,
  end: number,
): number {
  // Choose an exploration order that makes first arrival prove minimum edge count.
  // Define when nodes become visited and what one frontier entry represents.
  // Include isolated, unreachable, and start-equals-end cases.
  void serviceCount
  void edges
  void start
  void end
  throw new Error('TODO: complete final simulation part B')
}
