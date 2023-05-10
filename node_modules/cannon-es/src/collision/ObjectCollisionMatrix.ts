import type { Body } from '../objects/Body'

/**
 * Records what objects are colliding with each other
 */
export class ObjectCollisionMatrix {
  /**
   * The matrix storage.
   */
  matrix: Record<string, boolean>

  /**
   * @todo Remove useless constructor
   */
  constructor() {
    this.matrix = {}
  }

  /**
   * get
   */
  get(bi: Body, bj: Body): boolean {
    let { id: i } = bi
    let { id: j } = bj
    if (j > i) {
      const temp = j
      j = i
      i = temp
    }
    return `${i}-${j}` in this.matrix
  }

  /**
   * set
   */
  set(bi: Body, bj: Body, value: boolean): void {
    let { id: i } = bi
    let { id: j } = bj
    if (j > i) {
      const temp = j
      j = i
      i = temp
    }
    if (value) {
      this.matrix[`${i}-${j}`] = true
    } else {
      delete this.matrix[`${i}-${j}`]
    }
  }

  /**
   * Empty the matrix
   */
  reset(): void {
    this.matrix = {}
  }

  /**
   * Set max number of objects
   */
  setNumObjects(n: number): void {}
}
