import { Vec3 } from '../math/Vec3'
import type { Quaternion } from '../math/Quaternion'

/**
 * A 3x3 matrix.
 * Authored by {@link http://github.com/schteppe/ schteppe}
 */
export class Mat3 {
  /**
   * A vector of length 9, containing all matrix elements.
   */
  elements: number[]

  /**
   * @param elements A vector of length 9, containing all matrix elements.
   */
  constructor(elements = [0, 0, 0, 0, 0, 0, 0, 0, 0]) {
    this.elements = elements
  }

  /**
   * Sets the matrix to identity
   * @todo Should perhaps be renamed to `setIdentity()` to be more clear.
   * @todo Create another function that immediately creates an identity matrix eg. `eye()`
   */
  identity(): void {
    const e = this.elements
    e[0] = 1
    e[1] = 0
    e[2] = 0

    e[3] = 0
    e[4] = 1
    e[5] = 0

    e[6] = 0
    e[7] = 0
    e[8] = 1
  }

  /**
   * Set all elements to zero
   */
  setZero(): void {
    const e = this.elements
    e[0] = 0
    e[1] = 0
    e[2] = 0
    e[3] = 0
    e[4] = 0
    e[5] = 0
    e[6] = 0
    e[7] = 0
    e[8] = 0
  }

  /**
   * Sets the matrix diagonal elements from a Vec3
   */
  setTrace(vector: Vec3): void {
    const e = this.elements
    e[0] = vector.x
    e[4] = vector.y
    e[8] = vector.z
  }

  /**
   * Gets the matrix diagonal elements
   */
  getTrace(target = new Vec3()): Vec3 {
    const e = this.elements
    target.x = e[0]
    target.y = e[4]
    target.z = e[8]
    return target
  }

  /**
   * Matrix-Vector multiplication
   * @param v The vector to multiply with
   * @param target Optional, target to save the result in.
   */
  vmult(v: Vec3, target = new Vec3()): Vec3 {
    const e = this.elements
    const x = v.x
    const y = v.y
    const z = v.z
    target.x = e[0] * x + e[1] * y + e[2] * z
    target.y = e[3] * x + e[4] * y + e[5] * z
    target.z = e[6] * x + e[7] * y + e[8] * z

    return target
  }

  /**
   * Matrix-scalar multiplication
   */
  smult(s: number): void {
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i] *= s
    }
  }

  /**
   * Matrix multiplication
   * @param matrix Matrix to multiply with from left side.
   */
  mmult(matrix: Mat3, target = new Mat3()): Mat3 {
    const A = this.elements
    const B = matrix.elements
    const T = target.elements

    const a11 = A[0],
      a12 = A[1],
      a13 = A[2],
      a21 = A[3],
      a22 = A[4],
      a23 = A[5],
      a31 = A[6],
      a32 = A[7],
      a33 = A[8]

    const b11 = B[0],
      b12 = B[1],
      b13 = B[2],
      b21 = B[3],
      b22 = B[4],
      b23 = B[5],
      b31 = B[6],
      b32 = B[7],
      b33 = B[8]

    T[0] = a11 * b11 + a12 * b21 + a13 * b31
    T[1] = a11 * b12 + a12 * b22 + a13 * b32
    T[2] = a11 * b13 + a12 * b23 + a13 * b33

    T[3] = a21 * b11 + a22 * b21 + a23 * b31
    T[4] = a21 * b12 + a22 * b22 + a23 * b32
    T[5] = a21 * b13 + a22 * b23 + a23 * b33

    T[6] = a31 * b11 + a32 * b21 + a33 * b31
    T[7] = a31 * b12 + a32 * b22 + a33 * b32
    T[8] = a31 * b13 + a32 * b23 + a33 * b33

    return target
  }

  /**
   * Scale each column of the matrix
   */
  scale(vector: Vec3, target = new Mat3()): Mat3 {
    const e = this.elements
    const t = target.elements
    for (let i = 0; i !== 3; i++) {
      t[3 * i + 0] = vector.x * e[3 * i + 0]
      t[3 * i + 1] = vector.y * e[3 * i + 1]
      t[3 * i + 2] = vector.z * e[3 * i + 2]
    }
    return target
  }

  /**
   * Solve Ax=b
   * @param b The right hand side
   * @param target Optional. Target vector to save in.
   * @return The solution x
   * @todo should reuse arrays
   */
  solve(b: Vec3, target = new Vec3()): Vec3 {
    // Construct equations
    const nr = 3 // num rows
    const nc = 4 // num cols
    const eqns = []
    let i: number
    let j: number
    for (i = 0; i < nr * nc; i++) {
      eqns.push(0)
    }
    for (i = 0; i < 3; i++) {
      for (j = 0; j < 3; j++) {
        eqns[i + nc * j] = this.elements[i + 3 * j]
      }
    }
    eqns[3 + 4 * 0] = b.x
    eqns[3 + 4 * 1] = b.y
    eqns[3 + 4 * 2] = b.z

    // Compute right upper triangular version of the matrix - Gauss elimination
    let n = 3

    const k = n
    let np
    const kp = 4 // num rows
    let p
    do {
      i = k - n
      if (eqns[i + nc * i] === 0) {
        // the pivot is null, swap lines
        for (j = i + 1; j < k; j++) {
          if (eqns[i + nc * j] !== 0) {
            np = kp
            do {
              // do ligne( i ) = ligne( i ) + ligne( k )
              p = kp - np
              eqns[p + nc * i] += eqns[p + nc * j]
            } while (--np)
            break
          }
        }
      }
      if (eqns[i + nc * i] !== 0) {
        for (j = i + 1; j < k; j++) {
          const multiplier: number = eqns[i + nc * j] / eqns[i + nc * i]
          np = kp
          do {
            // do ligne( k ) = ligne( k ) - multiplier * ligne( i )
            p = kp - np
            eqns[p + nc * j] = p <= i ? 0 : eqns[p + nc * j] - eqns[p + nc * i] * multiplier
          } while (--np)
        }
      }
    } while (--n)

    // Get the solution
    target.z = eqns[2 * nc + 3] / eqns[2 * nc + 2]
    target.y = (eqns[1 * nc + 3] - eqns[1 * nc + 2] * target.z) / eqns[1 * nc + 1]
    target.x = (eqns[0 * nc + 3] - eqns[0 * nc + 2] * target.z - eqns[0 * nc + 1] * target.y) / eqns[0 * nc + 0]

    if (
      isNaN(target.x) ||
      isNaN(target.y) ||
      isNaN(target.z) ||
      target.x === Infinity ||
      target.y === Infinity ||
      target.z === Infinity
    ) {
      throw `Could not solve equation! Got x=[${target.toString()}], b=[${b.toString()}], A=[${this.toString()}]`
    }

    return target
  }

  /**
   * Get an element in the matrix by index. Index starts at 0, not 1!!!
   * @param value If provided, the matrix element will be set to this value.
   */
  e(row: number, column: number): number
  e(row: number, column: number, value: number): void
  e(row: number, column: number, value?: number): number | void {
    if (value === undefined) {
      return this.elements[column + 3 * row]
    } else {
      // Set value
      this.elements[column + 3 * row] = value
    }
  }

  /**
   * Copy another matrix into this matrix object.
   */
  copy(matrix: Mat3): Mat3 {
    for (let i = 0; i < matrix.elements.length; i++) {
      this.elements[i] = matrix.elements[i]
    }
    return this
  }

  /**
   * Returns a string representation of the matrix.
   */
  toString(): string {
    let r = ''
    const sep = ','
    for (let i = 0; i < 9; i++) {
      r += this.elements[i] + sep
    }
    return r
  }

  /**
   * reverse the matrix
   * @param target Target matrix to save in.
   * @return The solution x
   */
  reverse(target = new Mat3()): Mat3 {
    // Construct equations
    const nr = 3 // num rows
    const nc = 6 // num cols
    const eqns = reverse_eqns
    let i: number
    let j: number
    for (i = 0; i < 3; i++) {
      for (j = 0; j < 3; j++) {
        eqns[i + nc * j] = this.elements[i + 3 * j]
      }
    }
    eqns[3 + 6 * 0] = 1
    eqns[3 + 6 * 1] = 0
    eqns[3 + 6 * 2] = 0
    eqns[4 + 6 * 0] = 0
    eqns[4 + 6 * 1] = 1
    eqns[4 + 6 * 2] = 0
    eqns[5 + 6 * 0] = 0
    eqns[5 + 6 * 1] = 0
    eqns[5 + 6 * 2] = 1

    // Compute right upper triangular version of the matrix - Gauss elimination
    let n = 3

    const k = n
    let np
    const kp = nc // num rows
    let p
    do {
      i = k - n
      if (eqns[i + nc * i] === 0) {
        // the pivot is null, swap lines
        for (j = i + 1; j < k; j++) {
          if (eqns[i + nc * j] !== 0) {
            np = kp
            do {
              // do line( i ) = line( i ) + line( k )
              p = kp - np
              eqns[p + nc * i] += eqns[p + nc * j]
            } while (--np)
            break
          }
        }
      }
      if (eqns[i + nc * i] !== 0) {
        for (j = i + 1; j < k; j++) {
          const multiplier: number = eqns[i + nc * j] / eqns[i + nc * i]
          np = kp
          do {
            // do line( k ) = line( k ) - multiplier * line( i )
            p = kp - np
            eqns[p + nc * j] = p <= i ? 0 : eqns[p + nc * j] - eqns[p + nc * i] * multiplier
          } while (--np)
        }
      }
    } while (--n)

    // eliminate the upper left triangle of the matrix
    i = 2
    do {
      j = i - 1
      do {
        const multiplier: number = eqns[i + nc * j] / eqns[i + nc * i]
        np = nc
        do {
          p = nc - np
          eqns[p + nc * j] = eqns[p + nc * j] - eqns[p + nc * i] * multiplier
        } while (--np)
      } while (j--)
    } while (--i)

    // operations on the diagonal
    i = 2
    do {
      const multiplier: number = 1 / eqns[i + nc * i]
      np = nc
      do {
        p = nc - np
        eqns[p + nc * i] = eqns[p + nc * i] * multiplier
      } while (--np)
    } while (i--)

    i = 2
    do {
      j = 2
      do {
        p = eqns[nr + j + nc * i]
        if (isNaN(p) || p === Infinity) {
          throw `Could not reverse! A=[${this.toString()}]`
        }
        target.e(i, j, p)
      } while (j--)
    } while (i--)

    return target
  }

  /**
   * Set the matrix from a quaterion
   */
  setRotationFromQuaternion(q: Quaternion): Mat3 {
    const x = q.x
    const y = q.y
    const z = q.z
    const w = q.w
    const x2 = x + x
    const y2 = y + y
    const z2 = z + z
    const xx = x * x2
    const xy = x * y2
    const xz = x * z2
    const yy = y * y2
    const yz = y * z2
    const zz = z * z2
    const wx = w * x2
    const wy = w * y2
    const wz = w * z2
    const e = this.elements

    e[3 * 0 + 0] = 1 - (yy + zz)
    e[3 * 0 + 1] = xy - wz
    e[3 * 0 + 2] = xz + wy

    e[3 * 1 + 0] = xy + wz
    e[3 * 1 + 1] = 1 - (xx + zz)
    e[3 * 1 + 2] = yz - wx

    e[3 * 2 + 0] = xz - wy
    e[3 * 2 + 1] = yz + wx
    e[3 * 2 + 2] = 1 - (xx + yy)

    return this
  }

  /**
   * Transpose the matrix
   * @param target Optional. Where to store the result.
   * @return The target Mat3, or a new Mat3 if target was omitted.
   */
  transpose(target = new Mat3()): Mat3 {
    const M = this.elements
    const T = target.elements
    let tmp

    //Set diagonals
    T[0] = M[0]
    T[4] = M[4]
    T[8] = M[8]

    tmp = M[1]
    T[1] = M[3]
    T[3] = tmp

    tmp = M[2]
    T[2] = M[6]
    T[6] = tmp

    tmp = M[5]
    T[5] = M[7]
    T[7] = tmp

    return target
  }
}

const reverse_eqns = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
