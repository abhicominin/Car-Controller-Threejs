import { Vec3 } from './Vec3'

describe('Vec3', () => {
  test('construct', () => {
    const v = new Vec3(1, 2, 3)
    expect(v.x).toBe(1)
    expect(v.y).toBe(2)
    expect(v.z).toBe(3)
  })

  test('cross', () => {
    const v = new Vec3(1, 2, 3)
    const u = new Vec3(4, 5, 6)

    const v_x_u = v.cross(u)
    expect(v_x_u.x).toBe(-3)
    expect(v_x_u.y).toBe(6)
    expect(v_x_u.z).toBe(-3)
  })

  test('set', () => {
    const v = new Vec3(1, 2, 3)
    v.set(4, 5, 6)

    expect(v.x).toBe(4)
    expect(v.y).toBe(5)
    expect(v.z).toBe(6)
  })

  test('setZero', () => {
    const v = new Vec3(1, 2, 3)
    v.setZero()
    expect(v.x).toBe(0)
    expect(v.y).toBe(0)
    expect(v.z).toBe(0)
  })

  test('vadd', () => {
    const v = new Vec3(1, 2, 3)
    const u = new Vec3(4, 5, 6)

    const w = v.vadd(u)
    expect(w.x).toBe(5)
    expect(w.y).toBe(7)
    expect(w.z).toBe(9)
  })

  test('vsub', () => {
    const v = new Vec3(1, 2, 3)
    const u = new Vec3(4, 6, 8)

    const w = v.vsub(u)
    expect(w.x).toBe(-3)
    expect(w.y).toBe(-4)
    expect(w.z).toBe(-5)
  })

  test('normalize', () => {
    const v = new Vec3(2, 3, 6)
    const norm = v.normalize()
    expect(norm).toBe(7)
    expect(v.x).toBeCloseTo(2 / 7)
    expect(v.y).toBeCloseTo(3 / 7)
    expect(v.z).toBeCloseTo(6 / 7)
  })

  test('normalize_0', () => {
    const v = new Vec3(0, 0, 0)
    const something = v.normalize()
    expect(something).toBeDefined()
  })

  test('unit', () => {
    const v = new Vec3(2, 3, 6)

    //Test for returning new vector
    const unit_v = v.unit()
    expect(unit_v.x).toBeCloseTo(2 / 7)
    expect(unit_v.y).toBeCloseTo(3 / 7)
    expect(unit_v.z).toBeCloseTo(6 / 7)
  })

  test('unit_0', () => {
    const v = new Vec3(0, 0, 0)
    const something = v.unit()
    expect(something).toBeDefined()
  })

  test('length', () => {
    const v = new Vec3(2, 3, 6)
    const v_len = v.length()
    expect(v_len).toBeCloseTo(7)
  })

  test('lengthSquared', () => {
    const v = new Vec3(2, 3, 6)
    const v_len_2 = v.lengthSquared()
    expect(v_len_2).toBe(7 * 7)
  })

  test('distanceTo', () => {
    const v = new Vec3(1, 2, 3)
    const u = new Vec3(3, 5, 9)
    expect(v.distanceTo(u)).toBeCloseTo(7)
    expect(u.distanceTo(v)).toBeCloseTo(7)
  })

  test('distanceSquared', () => {
    const v = new Vec3(1, 2, 3)
    const u = new Vec3(3, 5, 9)
    expect(v.distanceSquared(u)).toBe(7 * 7)
    expect(u.distanceSquared(v)).toBe(7 * 7)
  })

  test('scale', () => {
    const v = new Vec3(1, 2, 3)

    const v2 = v.scale(2)
    expect(v2.x).toBe(2)
    expect(v2.y).toBe(4)
    expect(v2.z).toBe(6)
  })

  test('vmul', () => {
    const v = new Vec3(1, 2, 3)
    const u = new Vec3(4, 5, 6)

    const vu = v.vmul(u)
    expect(vu.x).toBe(4)
    expect(vu.y).toBe(10)
    expect(vu.z).toBe(18)
  })

  test('addScaledVector', () => {
    const v = new Vec3(1, 2, 3)
    const u = new Vec3(4, 5, 6)

    const v3u = v.addScaledVector(3, u)
    expect(v3u.x).toBe(13)
    expect(v3u.y).toBe(17)
    expect(v3u.z).toBe(21)
  })

  test('dot', () => {
    let v = new Vec3(1, 2, 3)
    let u = new Vec3(4, 5, 6)
    let dot = v.dot(u)

    expect(dot).toBe(4 + 10 + 18)

    v = new Vec3(3, 2, 1)
    u = new Vec3(4, 5, 6)
    dot = v.dot(u)

    expect(dot).toBe(12 + 10 + 6)
  })

  test('isZero', () => {
    const v = new Vec3(1, 2, 3)
    expect(v.isZero()).toBe(false)

    const u = new Vec3(0, 0, 0)
    expect(u.isZero()).toBe(true)
  })

  test('negate', () => {
    const v = new Vec3(1, 2, 3)

    const neg_v = v.negate()
    expect(neg_v.x).toBe(-1)
    expect(neg_v.y).toBe(-2)
    expect(neg_v.z).toBe(-3)
  })

  test('tangents', () => {
    const v = new Vec3(1, 2, 3)
    const vt1 = new Vec3()
    const vt2 = new Vec3()
    v.tangents(vt1, vt2)
    expect(vt1.dot(v)).toBeCloseTo(0)
    expect(vt2.dot(v)).toBeCloseTo(0)
    expect(vt1.dot(vt2)).toBeCloseTo(0)
  })

  test('toString', () => {
    const v = new Vec3(1, 2, 3)
    expect(v.toString()).toBe('1,2,3')
  })

  test('toArray', () => {
    const v = new Vec3(1, 2, 3)
    const v_a = v.toArray()
    expect(v_a[0]).toBe(1)
    expect(v_a[1]).toBe(2)
    expect(v_a[2]).toBe(3)
  })

  test('copy', () => {
    const v = new Vec3(1, 2, 3)
    const u = new Vec3()
    u.copy(v)
    expect(u.x).toBe(1)
    expect(u.y).toBe(2)
    expect(u.z).toBe(3)
  })

  test('lerp', () => {
    const v = new Vec3(1, 2, 3)
    const u = new Vec3(5, 6, 7)

    const vlerpu = new Vec3()
    v.lerp(u, 0.5, vlerpu)
    expect(vlerpu.x).toBeCloseTo(3)
    expect(vlerpu.y).toBeCloseTo(4)
    expect(vlerpu.z).toBeCloseTo(5)
  })

  test('almostEquals', () => {
    expect(new Vec3(1, 0, 0).almostEquals(new Vec3(1, 0, 0))).toBe(true)
    expect(new Vec3(1e-5, 1e-5, 1e-5).almostEquals(new Vec3(), 1e-6)).toBe(false)
    expect(new Vec3(1e-7, 1e-7, 1e-7).almostEquals(new Vec3(), 1e-6)).toBe(true)
  })

  test('almostZero', () => {
    expect(new Vec3(1, 0, 0).almostZero()).toBe(false)
    expect(new Vec3(1e-7, 1e-7, 1e-7).almostZero(1e-6)).toBe(true)
    expect(new Vec3(1e-5, 1e-5, 1e-5).almostZero(1e-6)).toBe(false)
  })

  test('isAntiparallelTo', () => {
    expect(new Vec3(1, 0, 0).isAntiparallelTo(new Vec3(-1, 0, 0))).toBe(true)
    expect(new Vec3(1, 0, 0).isAntiparallelTo(new Vec3(1, 0, 0))).toBe(false)
  })

  test('clone', () => {
    const v = new Vec3(1, 2, 3)
    const u = v.clone()
    v.x = 4
    v.y = 5
    v.z = 6
    expect(u.x).toBe(1)
    expect(u.y).toBe(2)
    expect(u.z).toBe(3)
  })
})
