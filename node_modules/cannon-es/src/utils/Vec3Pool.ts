import { Pool } from '../utils/Pool'
import { Vec3 } from '../math/Vec3'

/**
 * Vec3Pool
 */
export class Vec3Pool extends Pool {
  type = Vec3

  /**
   * Construct a vector
   */
  constructObject(): Vec3 {
    return new Vec3()
  }
}
