export class MinPriorityQueue {
  private readonly values: number[] = []

  get size(): number {
    return this.values.length
  }

  enqueue(value: number): void {
    this.values.push(value)
    let index = this.values.length - 1
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2)
      if (this.values[parent]! <= this.values[index]!) return
      ;[this.values[parent], this.values[index]] = [this.values[index]!, this.values[parent]!]
      index = parent
    }
  }

  dequeue(): number | undefined {
    if (this.values.length === 0) return undefined
    const result = this.values[0]!
    const last = this.values.pop()!
    if (this.values.length > 0) {
      this.values[0] = last
      let index = 0
      while (true) {
        const left = index * 2 + 1
        const right = left + 1
        let smallest = index
        if (left < this.values.length && this.values[left]! < this.values[smallest]!)
          smallest = left
        if (right < this.values.length && this.values[right]! < this.values[smallest]!)
          smallest = right
        if (smallest === index) break
        ;[this.values[index], this.values[smallest]] = [this.values[smallest]!, this.values[index]!]
        index = smallest
      }
    }
    return result
  }

  peek(): number | undefined {
    return this.values[0]
  }
}
