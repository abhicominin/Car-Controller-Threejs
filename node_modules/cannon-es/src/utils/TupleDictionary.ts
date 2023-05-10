/**
 * TupleDictionary
 */
export class TupleDictionary {
  data: { [id: string]: any; keys: string[] } = { keys: [] }

  /** get */
  get(i: number, j: number): any {
    if (i > j) {
      // swap
      const temp = j
      j = i
      i = temp
    }
    return this.data[`${i}-${j}`]
  }

  /** set */
  set(i: number, j: number, value: any): void {
    if (i > j) {
      const temp = j
      j = i
      i = temp
    }
    const key = `${i}-${j}`

    // Check if key already exists
    if (!this.get(i, j)) {
      this.data.keys.push(key)
    }

    this.data[key] = value
  }

  /** reset */
  reset(): void {
    const data = this.data
    const keys = data.keys
    while (keys.length > 0) {
      const key = keys.pop()!
      delete data[key]
    }
  }
}
