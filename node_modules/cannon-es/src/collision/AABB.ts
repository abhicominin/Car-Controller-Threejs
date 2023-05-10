import { Vec3 } from '../math/Vec3'
import type { Ray } from '../collision/Ray'
import type { Transform } from '../math/Transform'
import type { Quaternion } from '../math/Quaternion'

/**
 * Axis aligned bounding box class.
 */
export class AABB {
  /**
   * The lower bound of the bounding box
   */
  lowerBound: Vec3
  /**
   * The upper bound of the bounding box
   */
  upperBound: Vec3

  constructor(
    options: {
      /**
       * The lower bound of the bounding box
       */
      upperBound?: Vec3
      /**
       * The upper bound of the bounding box
       */
      lowerBound?: Vec3
    } = {}
  ) {
    this.lowerBound = new Vec3()
    this.upperBound = new Vec3()

    if (options.lowerBound) {
      this.lowerBound.copy(options.lowerBound)
    }

    if (options.upperBound) {
      this.upperBound.copy(options.upperBound)
    }
  }

  /**
   * Set the AABB bounds from a set of points.
   * @param points An array of Vec3's.
   * @return The self object
   */
  setFromPoints(points: Vec3[], position?: Vec3, quaternion?: Quaternion, skinSize?: number): AABB {
    const l = this.lowerBound
    const u = this.upperBound
    const q = quaternion

    // Set to the first point
    l.copy(points[0])
    if (q) {
      q.vmult(l, l)
    }
    u.copy(l)

    for (let i = 1; i < points.length; i++) {
      let p = points[i]

      if (q) {
        q.vmult(p, tmp)
        p = tmp
      }

      if (p.x > u.x) {
        u.x = p.x
      }
      if (p.x < l.x) {
        l.x = p.x
      }
      if (p.y > u.y) {
        u.y = p.y
      }
      if (p.y < l.y) {
        l.y = p.y
      }
      if (p.z > u.z) {
        u.z = p.z
      }
      if (p.z < l.z) {
        l.z = p.z
      }
    }

    // Add offset
    if (position) {
      position.vadd(l, l)
      position.vadd(u, u)
    }

    if (skinSize) {
      l.x -= skinSize
      l.y -= skinSize
      l.z -= skinSize
      u.x += skinSize
      u.y += skinSize
      u.z += skinSize
    }

    return this
  }

  /**
   * Copy bounds from an AABB to this AABB
   * @param aabb Source to copy from
   * @return The this object, for chainability
   */
  copy(aabb: AABB): AABB {
    this.lowerBound.copy(aabb.lowerBound)
    this.upperBound.copy(aabb.upperBound)
    return this
  }

  /**
   * Clone an AABB
   */
  clone(): AABB {
    return new AABB().copy(this)
  }

  /**
   * Extend this AABB so that it covers the given AABB too.
   */
  extend(aabb: AABB): void {
    this.lowerBound.x = Math.min(this.lowerBound.x, aabb.lowerBound.x)
    this.upperBound.x = Math.max(this.upperBound.x, aabb.upperBound.x)
    this.lowerBound.y = Math.min(this.lowerBound.y, aabb.lowerBound.y)
    this.upperBound.y = Math.max(this.upperBound.y, aabb.upperBound.y)
    this.lowerBound.z = Math.min(this.lowerBound.z, aabb.lowerBound.z)
    this.upperBound.z = Math.max(this.upperBound.z, aabb.upperBound.z)
  }

  /**
   * Returns true if the given AABB overlaps this AABB.
   */
  overlaps(aabb: AABB): boolean {
    const l1 = this.lowerBound
    const u1 = this.upperBound
    const l2 = aabb.lowerBound
    const u2 = aabb.upperBound

    //      l2        u2
    //      |---------|
    // |--------|
    // l1       u1

    const overlapsX = (l2.x <= u1.x && u1.x <= u2.x) || (l1.x <= u2.x && u2.x <= u1.x)
    const overlapsY = (l2.y <= u1.y && u1.y <= u2.y) || (l1.y <= u2.y && u2.y <= u1.y)
    const overlapsZ = (l2.z <= u1.z && u1.z <= u2.z) || (l1.z <= u2.z && u2.z <= u1.z)

    return overlapsX && overlapsY && overlapsZ
  }

  // Mostly for debugging
  volume(): number {
    const l = this.lowerBound
    const u = this.upperBound
    return (u.x - l.x) * (u.y - l.y) * (u.z - l.z)
  }

  /**
   * Returns true if the given AABB is fully contained in this AABB.
   */
  contains(aabb: AABB): boolean {
    const l1 = this.lowerBound
    const u1 = this.upperBound
    const l2 = aabb.lowerBound
    const u2 = aabb.upperBound

    //      l2        u2
    //      |---------|
    // |---------------|
    // l1              u1

    return l1.x <= l2.x && u1.x >= u2.x && l1.y <= l2.y && u1.y >= u2.y && l1.z <= l2.z && u1.z >= u2.z
  }

  getCorners(a: Vec3, b: Vec3, c: Vec3, d: Vec3, e: Vec3, f: Vec3, g: Vec3, h: Vec3): void {
    const l = this.lowerBound
    const u = this.upperBound

    a.copy(l)
    b.set(u.x, l.y, l.z)
    c.set(u.x, u.y, l.z)
    d.set(l.x, u.y, u.z)
    e.set(u.x, l.y, u.z)
    f.set(l.x, u.y, l.z)
    g.set(l.x, l.y, u.z)
    h.copy(u)
  }

  /**
   * Get the representation of an AABB in another frame.
   * @return The "target" AABB object.
   */
  toLocalFrame(frame: Transform, target: AABB): AABB {
    const corners = transformIntoFrame_corners
    const a = corners[0]
    const b = corners[1]
    const c = corners[2]
    const d = corners[3]
    const e = corners[4]
    const f = corners[5]
    const g = corners[6]
    const h = corners[7]

    // Get corners in current frame
    this.getCorners(a, b, c, d, e, f, g, h)

    // Transform them to new local frame
    for (let i = 0; i !== 8; i++) {
      const corner = corners[i]
      frame.pointToLocal(corner, corner)
    }

    return target.setFromPoints(corners)
  }

  /**
   * Get the representation of an AABB in the global frame.
   * @return The "target" AABB object.
   */
  toWorldFrame(frame: Transform, target: AABB): AABB {
    const corners = transformIntoFrame_corners
    const a = corners[0]
    const b = corners[1]
    const c = corners[2]
    const d = corners[3]
    const e = corners[4]
    const f = corners[5]
    const g = corners[6]
    const h = corners[7]

    // Get corners in current frame
    this.getCorners(a, b, c, d, e, f, g, h)

    // Transform them to new local frame
    for (let i = 0; i !== 8; i++) {
      const corner = corners[i]
      frame.pointToWorld(corner, corner)
    }

    return target.setFromPoints(corners)
  }

  /**
   * Check if the AABB is hit by a ray.
   */
  overlapsRay(ray: Ray): boolean {
    const { direction, from } = ray
    // const t = 0

    // ray.direction is unit direction vector of ray
    const dirFracX = 1 / direction.x
    const dirFracY = 1 / direction.y
    const dirFracZ = 1 / direction.z

    // this.lowerBound is the corner of AABB with minimal coordinates - left bottom, rt is maximal corner
    const t1 = (this.lowerBound.x - from.x) * dirFracX
    const t2 = (this.upperBound.x - from.x) * dirFracX
    const t3 = (this.lowerBound.y - from.y) * dirFracY
    const t4 = (this.upperBound.y - from.y) * dirFracY
    const t5 = (this.lowerBound.z - from.z) * dirFracZ
    const t6 = (this.upperBound.z - from.z) * dirFracZ

    // const tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)));
    // const tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)));
    const tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6))
    const tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6))

    // if tmax < 0, ray (line) is intersecting AABB, but whole AABB is behing us
    if (tmax < 0) {
      //t = tmax;
      return false
    }

    // if tmin > tmax, ray doesn't intersect AABB
    if (tmin > tmax) {
      //t = tmax;
      return false
    }

    return true
  }
}

const tmp = new Vec3()

const transformIntoFrame_corners = [
  new Vec3(),
  new Vec3(),
  new Vec3(),
  new Vec3(),
  new Vec3(),
  new Vec3(),
  new Vec3(),
  new Vec3(),
]
