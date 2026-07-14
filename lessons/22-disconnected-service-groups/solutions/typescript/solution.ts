export type Connection = [number, number]

export function countServiceGroups(serviceCount: number, connections: Connection[]): number {
  // Contrast the single-root guarantee of a tree with a graph that may be disconnected.
  // Define what visited means and when a newly encountered service should be marked.
  // Include isolated services and both directions of each undirected connection.
  void serviceCount
  void connections
  throw new Error('TODO: count all connected service groups')
}
