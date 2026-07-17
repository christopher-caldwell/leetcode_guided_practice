const maximumSizeKey = Symbol.for('leetcode-workshop.min-priority-queue.maximum-size')

function recordMaximumSize(size: number): void {
  const metrics = globalThis as Record<PropertyKey, unknown>
  const previous = typeof metrics[maximumSizeKey] === 'number' ? metrics[maximumSizeKey] : 0
  metrics[maximumSizeKey] = Math.max(previous as number, size)
}

export class MinPriorityQueue<T> {
  private readonly entries: Array<{ value: T; priority: number }> = []

  get size(): number {
    return this.entries.length
  }

  enqueue(value: T, priority: number): void {
    this.entries.push({ value, priority })
    recordMaximumSize(this.entries.length)
    this.bubbleUp(this.entries.length - 1)
  }

  dequeue(): T | undefined {
    if (this.entries.length === 0) return undefined
    const first = this.entries[0]!
    const last = this.entries.pop()!
    if (this.entries.length > 0) {
      this.entries[0] = last
      this.bubbleDown(0)
    }
    return first.value
  }

  peek(): T | undefined {
    return this.entries[0]?.value
  }

  private bubbleUp(start: number): void {
    let index = start
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2)
      if (this.entries[parent]!.priority <= this.entries[index]!.priority) return
      ;[this.entries[parent], this.entries[index]] = [this.entries[index]!, this.entries[parent]!]
      index = parent
    }
  }

  private bubbleDown(start: number): void {
    let index = start
    while (true) {
      const left = index * 2 + 1
      const right = left + 1
      let smallest = index
      if (
        left < this.entries.length &&
        this.entries[left]!.priority < this.entries[smallest]!.priority
      )
        smallest = left
      if (
        right < this.entries.length &&
        this.entries[right]!.priority < this.entries[smallest]!.priority
      )
        smallest = right
      if (smallest === index) return
      ;[this.entries[index], this.entries[smallest]] = [
        this.entries[smallest]!,
        this.entries[index]!,
      ]
      index = smallest
    }
  }
}
