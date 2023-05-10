import { Vec3 } from '../math/Vec3'

/**
 * An element containing 6 entries, 3 spatial and 3 rotational degrees of freedom.
 */
export class JacobianElement {
  /**
   * spatial
   */
  spatial: Vec3
  /**
   * rotational
   */
  rotational: Vec3

  constructor() {
    this.spatial = new Vec3()
    this.rotational = new Vec3()
  }

  /**
   * Multiply with other JacobianElement
   */
  multiplyElement(element: JacobianElement): number {
    return element.spatial.dot(this.spatial) + element.rotational.dot(this.rotational)
  }

  /**
   * Multiply with two vectors
   */
  multiplyVectors(spatial: Vec3, rotational: Vec3): number {
    return spatial.dot(this.spatial) + rotational.dot(this.rotational)
  }
}
