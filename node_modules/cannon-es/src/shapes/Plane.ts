import { Shape } from '../shapes/Shape'
import { Vec3 } from '../math/Vec3'
import type { Quaternion } from '../math/Quaternion'

/**
 * A plane, facing in the Z direction. The plane has its surface at z=0 and everything below z=0 is assumed to be solid plane. To make the plane face in some other direction than z, you must put it inside a Body and rotate that body. See the demos.
 * @example
 *     const planeShape = new CANNON.Plane()
 *     const planeBody = new CANNON.Body({ mass: 0, shape:  planeShape })
 *     planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
 *     world.addBody(planeBody)
 */
export class Plane extends Shape {
  /** worldNormal */
  worldNormal: Vec3
  /** worldNormalNeedsUpdate */
  worldNormalNeedsUpdate: boolean
  boundingSphereRadius: number

  constructor() {
    super({ type: Shape.types.PLANE })

    // World oriented normal
    this.worldNormal = new Vec3()
    this.worldNormalNeedsUpdate = true

    this.boundingSphereRadius = Number.MAX_VALUE
  }

  /** computeWorldNormal */
  computeWorldNormal(quat: Quaternion): void {
    const n = this.worldNormal
    n.set(0, 0, 1)
    quat.vmult(n, n)
    this.worldNormalNeedsUpdate = false
  }

  calculateLocalInertia(mass: number, target = new Vec3()): Vec3 {
    return target
  }

  volume(): number {
    return (
      // The plane is infinite...
      Number.MAX_VALUE
    )
  }

  calculateWorldAABB(pos: Vec3, quat: Quaternion, min: Vec3, max: Vec3): void {
    // The plane AABB is infinite, except if the normal is pointing along any axis
    tempNormal.set(0, 0, 1) // Default plane normal is z
    quat.vmult(tempNormal, tempNormal)
    const maxVal = Number.MAX_VALUE
    min.set(-maxVal, -maxVal, -maxVal)
    max.set(maxVal, maxVal, maxVal)

    if (tempNormal.x === 1) {
      max.x = pos.x
    } else if (tempNormal.x === -1) {
      min.x = pos.x
    }

    if (tempNormal.y === 1) {
      max.y = pos.y
    } else if (tempNormal.y === -1) {
      min.y = pos.y
    }

    if (tempNormal.z === 1) {
      max.z = pos.z
    } else if (tempNormal.z === -1) {
      min.z = pos.z
    }
  }

  updateBoundingSphereRadius(): void {
    this.boundingSphereRadius = Number.MAX_VALUE
  }
}

const tempNormal = new Vec3()
