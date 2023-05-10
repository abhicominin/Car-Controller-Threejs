import { Shape } from '../shapes/Shape'
import { Vec3 } from '../math/Vec3'
import type { Quaternion } from '../math/Quaternion'

/**
 * Spherical shape
 * @example
 *     const radius = 1
 *     const sphereShape = new CANNON.Sphere(radius)
 *     const sphereBody = new CANNON.Body({ mass: 1, shape: sphereShape })
 *     world.addBody(sphereBody)
 */
export class Sphere extends Shape {
  /**
   * The radius of the sphere.
   */
  radius: number

  /**
   *
   * @param radius The radius of the sphere, a non-negative number.
   */
  constructor(radius: number) {
    super({ type: Shape.types.SPHERE })

    this.radius = radius !== undefined ? radius : 1.0

    if (this.radius < 0) {
      throw new Error('The sphere radius cannot be negative.')
    }

    this.updateBoundingSphereRadius()
  }

  /** calculateLocalInertia */
  calculateLocalInertia(mass: number, target = new Vec3()): Vec3 {
    const I = (2.0 * mass * this.radius * this.radius) / 5.0
    target.x = I
    target.y = I
    target.z = I
    return target
  }

  /** volume */
  volume(): number {
    return (4.0 * Math.PI * Math.pow(this.radius, 3)) / 3.0
  }

  updateBoundingSphereRadius(): void {
    this.boundingSphereRadius = this.radius
  }

  calculateWorldAABB(pos: Vec3, quat: Quaternion, min: Vec3, max: Vec3): void {
    const r = this.radius
    const axes = ['x', 'y', 'z'] as ['x', 'y', 'z']
    for (let i = 0; i < axes.length; i++) {
      const ax = axes[i]
      min[ax] = pos[ax] - r
      max[ax] = pos[ax] + r
    }
  }
}
