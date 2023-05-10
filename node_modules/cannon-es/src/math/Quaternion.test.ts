import { Vec3 } from './Vec3'
import { Quaternion } from './Quaternion'

describe('Quaternion', () => {
  test('constructor', () => {
    const q = new Quaternion(1, 2, 3, 4)
    expect(q.x).toBe(1)
    expect(q.y).toBe(2)
    expect(q.z).toBe(3)
    expect(q.w).toBe(4)
  })

  test('conjugate', () => {
    const q = new Quaternion(1, 2, 3, 4)
    q.conjugate(q)
    expect(q.x).toBe(-1)
    expect(q.y).toBe(-2)
    expect(q.z).toBe(-3)
    expect(q.w).toBe(4)
  })

  test('inverse', () => {
    const q = new Quaternion(1, 2, 3, 4)
    const denominator = 1 * 1 + 2 * 2 + 3 * 3 + 4 * 4
    q.inverse(q)

    // Quaternion inverse is conjugate(q) / ||q||^2
    expect(q.x).toBe(-1 / denominator)
    expect(q.y).toBe(-2 / denominator)
    expect(q.z).toBe(-3 / denominator)
    expect(q.w).toBe(4 / denominator)
  })

  test('toEuler', () => {
    const q = new Quaternion()
    q.setFromAxisAngle(new Vec3(0, 0, 1), Math.PI / 4)
    const euler = new Vec3()
    q.toEuler(euler)

    // we should expect (0,0,pi/4)
    expect(euler.x).toBe(0)
    expect(euler.y).toBe(0)
    expect(euler.z).toBeCloseTo(Math.PI / 4)
  })

  test('setFromVectors', () => {
    const q = new Quaternion()
    q.setFromVectors(new Vec3(1, 0, 0), new Vec3(-1, 0, 0))
    expect(q.vmult(new Vec3(1, 0, 0)).almostEquals(new Vec3(-1, 0, 0))).toBe(true)

    q.setFromVectors(new Vec3(0, 1, 0), new Vec3(0, -1, 0))
    expect(q.vmult(new Vec3(0, 1, 0)).almostEquals(new Vec3(0, -1, 0))).toBe(true)

    q.setFromVectors(new Vec3(0, 0, 1), new Vec3(0, 0, -1))
    expect(q.vmult(new Vec3(0, 0, 1)).almostEquals(new Vec3(0, 0, -1))).toBe(true)

    q.setFromVectors(new Vec3(1, 2, 3), new Vec3(2, 1, 3))
    expect(q.vmult(new Vec3(1, 2, 3)).almostEquals(new Vec3(2, 1, 3))).toBe(true)
  })

  test('slerp', () => {
    var qa = new Quaternion()
    var qb = new Quaternion()
    qa.slerp(qb, 0.5, qb)
    expect(qa).toStrictEqual(qb)

    qa.setFromAxisAngle(new Vec3(0, 0, 1), Math.PI / 4)
    qb.setFromAxisAngle(new Vec3(0, 0, 1), -Math.PI / 4)
    qa.slerp(qb, 0.5, qb)
    expect(qb).toStrictEqual(new Quaternion())
  })

  test('set', () => {
    const q = new Quaternion(1, 2, 3, 4)
    q.set(5, 6, 7, 8)
    expect(q.x).toBe(5)
    expect(q.y).toBe(6)
    expect(q.z).toBe(7)
    expect(q.w).toBe(8)
  })

  test('toString', () => {
    const q = new Quaternion(1, 2, 3, 4)
    expect(q.toString()).toBe('1,2,3,4')
  })

  test('toArray', () => {
    const q = new Quaternion(1, 2, 3, 4)
    const qa = q.toArray()
    expect(qa[0]).toBe(1)
    expect(qa[1]).toBe(2)
    expect(qa[2]).toBe(3)
    expect(qa[3]).toBe(4)
  })

  test('copy', () => {
    const q = new Quaternion(1, 2, 3, 4)
    const qc = new Quaternion()
    qc.copy(q)
    q.set(4, 5, 6, 7)
    expect(qc.x).toBe(1)
    expect(qc.y).toBe(2)
    expect(qc.z).toBe(3)
    expect(qc.w).toBe(4)
  })

  test('clone', () => {
    const q = new Quaternion(1, 2, 3, 4)
    const qc = q.clone()
    q.set(4, 5, 6, 7)
    expect(qc.x).toBe(1)
    expect(qc.y).toBe(2)
    expect(qc.z).toBe(3)
    expect(qc.w).toBe(4)
  })
})
