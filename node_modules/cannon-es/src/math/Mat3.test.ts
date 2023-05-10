import { Mat3 } from './Mat3'
import { Vec3 } from './Vec3'
import { Quaternion } from './Quaternion'

describe('Mat3', () => {
  test('construct', () => {
    const m = new Mat3()
    for (let c = 0; c < 3; c++) {
      for (let r = 0; r < 3; r++) {
        expect(m.e(r, c)).toBe(0)
      }
    }
  })

  test('identity', () => {
    const m = new Mat3()
    m.identity()
    expect(m.e(0, 0)).toBe(1)
    expect(m.e(0, 1)).toBe(0)
    expect(m.e(0, 2)).toBe(0)
    expect(m.e(1, 0)).toBe(0)
    expect(m.e(1, 1)).toBe(1)
    expect(m.e(1, 2)).toBe(0)
    expect(m.e(2, 0)).toBe(0)
    expect(m.e(2, 1)).toBe(0)
    expect(m.e(2, 2)).toBe(1)
  })

  test('setZero', () => {
    const m = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9])
    m.setZero()
    for (let c = 0; c < 3; c++) {
      for (let r = 0; r < 3; r++) {
        expect(m.e(r, c)).toBe(0)
      }
    }
  })

  test('setTrace', () => {
    const m = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9])
    m.setTrace(new Vec3(10, 11, 12))

    expect(m.e(0, 0)).toBe(10)
    expect(m.e(0, 1)).toBe(2)
    expect(m.e(0, 2)).toBe(3)
    expect(m.e(1, 0)).toBe(4)
    expect(m.e(1, 1)).toBe(11)
    expect(m.e(1, 2)).toBe(6)
    expect(m.e(2, 0)).toBe(7)
    expect(m.e(2, 1)).toBe(8)
    expect(m.e(2, 2)).toBe(12)
  })

  test('getTrace', () => {
    const m = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9])

    const mTrace = m.getTrace()
    expect(mTrace.x).toBe(1)
    expect(mTrace.y).toBe(5)
    expect(mTrace.z).toBe(9)
  })

  test('vmult', () => {
    const v = new Vec3(2, 3, 7)
    const m = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9])

    const t = m.vmult(v)
    expect(t.x).toBe(29)
    expect(t.y).toBe(65)
    expect(t.z).toBe(101)
  })

  test('smult', () => {
    const m = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9])
    m.smult(10)
    expect(m.e(0, 0)).toBe(10)
    expect(m.e(0, 1)).toBe(20)
    expect(m.e(0, 2)).toBe(30)
    expect(m.e(1, 0)).toBe(40)
    expect(m.e(1, 1)).toBe(50)
    expect(m.e(1, 2)).toBe(60)
    expect(m.e(2, 0)).toBe(70)
    expect(m.e(2, 1)).toBe(80)
    expect(m.e(2, 2)).toBe(90)
  })

  test('mmult', () => {
    const m1 = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9])
    const m2 = new Mat3([5, 2, 4, 4, 5, 1, 1, 8, 0])

    const m3 = m1.mmult(m2)
    expect(m3.e(0, 0)).toBe(16)
    expect(m3.e(0, 1)).toBe(36)
    expect(m3.e(0, 2)).toBe(6)
    expect(m3.e(1, 0)).toBe(46)
    expect(m3.e(1, 1)).toBe(81)
    expect(m3.e(1, 2)).toBe(21)
    expect(m3.e(2, 0)).toBe(76)
    expect(m3.e(2, 1)).toBe(126)
    expect(m3.e(2, 2)).toBe(36)
  })

  test('mmult in place', () => {
    const m1 = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9])
    const m2 = new Mat3([5, 2, 4, 4, 5, 1, 1, 8, 0])

    //Test for changing input matrix
    m1.mmult(m2, m1)
    expect(m1.e(0, 0)).toBe(16)
    expect(m1.e(0, 1)).toBe(36)
    expect(m1.e(0, 2)).toBe(6)
    expect(m1.e(1, 0)).toBe(46)
    expect(m1.e(1, 1)).toBe(81)
    expect(m1.e(1, 2)).toBe(21)
    expect(m1.e(2, 0)).toBe(76)
    expect(m1.e(2, 1)).toBe(126)
    expect(m1.e(2, 2)).toBe(36)
  })

  test('scale', () => {
    const m = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9])
    const v = new Vec3(2, 3, 4)

    const m1 = new Mat3()
    m.scale(v, m1)
    expect(m1.e(0, 0)).toBe(2)
    expect(m1.e(0, 1)).toBe(6)
    expect(m1.e(0, 2)).toBe(12)
    expect(m1.e(1, 0)).toBe(8)
    expect(m1.e(1, 1)).toBe(15)
    expect(m1.e(1, 2)).toBe(24)
    expect(m1.e(2, 0)).toBe(14)
    expect(m1.e(2, 1)).toBe(24)
    expect(m1.e(2, 2)).toBe(36)
  })

  test('solve', () => {
    const A = new Mat3([0, 2, 3, -4, -5, -6, 7, -8, 9])
    const b = new Vec3(0 * 10 + 2 * 11 + 3 * 12, -4 * 10 + -5 * 11 + -6 * 12, 7 * 10 + -8 * 11 + 9 * 12)

    const x = A.solve(b)
    expect(x.x).toBeCloseTo(10)
    expect(x.y).toBeCloseTo(11)
    expect(x.z).toBeCloseTo(12)

    //Test for no solution error
    expect(() => {
      const C = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9])
      const d = new Vec3(1 * 10 + 2 * 11 + 3 * 12, 4 * 10 + 5 * 11 + 6 * 12, 7 * 10 + 8 * 11 + 9 * 12)
      C.solve(d, d)
    }).toThrow()
  })

  test('e', () => {
    //Getting
    const m = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9])
    expect(m.e(0, 0)).toBe(1)
    expect(m.e(0, 1)).toBe(2)
    expect(m.e(0, 2)).toBe(3)
    expect(m.e(1, 0)).toBe(4)
    expect(m.e(1, 1)).toBe(5)
    expect(m.e(1, 2)).toBe(6)
    expect(m.e(2, 0)).toBe(7)
    expect(m.e(2, 1)).toBe(8)
    expect(m.e(2, 2)).toBe(9)

    //Setting
    m.e(0, 0, -1)
    m.e(0, 1, -2)
    m.e(0, 2, -3)
    m.e(1, 0, -4)
    m.e(1, 1, -5)
    m.e(1, 2, -6)
    m.e(2, 0, -7)
    m.e(2, 1, -8)
    m.e(2, 2, -9)
    expect(m.e(0, 0)).toBe(-1)
    expect(m.e(0, 1)).toBe(-2)
    expect(m.e(0, 2)).toBe(-3)
    expect(m.e(1, 0)).toBe(-4)
    expect(m.e(1, 1)).toBe(-5)
    expect(m.e(1, 2)).toBe(-6)
    expect(m.e(2, 0)).toBe(-7)
    expect(m.e(2, 1)).toBe(-8)
    expect(m.e(2, 2)).toBe(-9)
  })

  test('copy', () => {
    const m = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9])
    const u = new Mat3()
    expect(u.copy(m)).toBe(u)
    m.e(0, 0, -1)
    m.e(0, 1, -2)
    m.e(0, 2, -3)
    m.e(1, 0, -4)
    m.e(1, 1, -5)
    m.e(1, 2, -6)
    m.e(2, 0, -7)
    m.e(2, 1, -8)
    m.e(2, 2, -9)
    expect(u.e(0, 0)).toBe(1)
    expect(u.e(0, 1)).toBe(2)
    expect(u.e(0, 2)).toBe(3)
    expect(u.e(1, 0)).toBe(4)
    expect(u.e(1, 1)).toBe(5)
    expect(u.e(1, 2)).toBe(6)
    expect(u.e(2, 0)).toBe(7)
    expect(u.e(2, 1)).toBe(8)
    expect(u.e(2, 2)).toBe(9)
  })

  test('toString', () => {
    const m = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9])
    expect(m.toString()).toBe('1,2,3,4,5,6,7,8,9,')
  })

  test('reverse', () => {
    const m = new Mat3([5, 2, 4, 4, 5, 1, 1, 8, 0])

    const m2 = m.reverse()
    const m3 = m2.mmult(m)
    const i = new Mat3([1, 0, 0, 0, 1, 0, 0, 0, 1])
    for (let c = 0; c < 3; c++) {
      for (let r = 0; r < 3; r++) {
        expect(m3.e(r, c)).toBeCloseTo(i.e(r, c))
      }
    }

    //Test different pivot
    const A = new Mat3([0, 2, 3, -4, -5, -6, 7, -8, 9])
    const b = new Vec3(0 * 10 + 2 * 11 + 3 * 12, -4 * 10 + -5 * 11 + -6 * 12, 7 * 10 + -8 * 11 + 9 * 12)
    const inA = A.reverse()
    const x = inA.vmult(b)
    expect(x.x).toBeCloseTo(10)
    expect(x.y).toBeCloseTo(11)
    expect(x.z).toBeCloseTo(12)

    //Test for no solution error
    expect(() => {
      const o = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9])
      o.reverse(o)
    }).toThrow()
  })

  test('setRotationFromQuaternion', () => {
    const M = new Mat3()
    const q = new Quaternion()
    const original = new Vec3(1, 2, 3)

    //Test zero rotation
    M.setRotationFromQuaternion(q)
    const v = M.vmult(original)
    expect(v.almostEquals(original))

    //Test rotation along x axis
    q.setFromEuler(0.222, 0.123, 1.234)
    M.setRotationFromQuaternion(q)
    const Mv = M.vmult(original)
    const qv = q.vmult(original)
    expect(Mv.almostEquals(qv))
  })

  test('transpose', () => {
    const M = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9])

    const Mt = M.transpose()
    expect(Mt.e(0, 0)).toBe(1)
    expect(Mt.e(0, 1)).toBe(4)
    expect(Mt.e(0, 2)).toBe(7)
    expect(Mt.e(1, 0)).toBe(2)
    expect(Mt.e(1, 1)).toBe(5)
    expect(Mt.e(1, 2)).toBe(8)
    expect(Mt.e(2, 0)).toBe(3)
    expect(Mt.e(2, 1)).toBe(6)
    expect(Mt.e(2, 2)).toBe(9)

    //Ensure input matrix unchanged
    expect(M.e(0, 0)).toBe(1)
    expect(M.e(0, 1)).toBe(2)
    expect(M.e(0, 2)).toBe(3)
    expect(M.e(1, 0)).toBe(4)
    expect(M.e(1, 1)).toBe(5)
    expect(M.e(1, 2)).toBe(6)
    expect(M.e(2, 0)).toBe(7)
    expect(M.e(2, 1)).toBe(8)
    expect(M.e(2, 2)).toBe(9)
  })

  test('transpose in place', () => {
    //Test for changing input matrix
    const M = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9])
    M.transpose(M)
    expect(M.e(0, 0)).toBe(1)
    expect(M.e(0, 1)).toBe(4)
    expect(M.e(0, 2)).toBe(7)
    expect(M.e(1, 0)).toBe(2)
    expect(M.e(1, 1)).toBe(5)
    expect(M.e(1, 2)).toBe(8)
    expect(M.e(2, 0)).toBe(3)
    expect(M.e(2, 1)).toBe(6)
    expect(M.e(2, 2)).toBe(9)
  })
})
