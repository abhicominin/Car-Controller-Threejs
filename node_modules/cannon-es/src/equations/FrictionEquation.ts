import { Equation } from '../equations/Equation'
import { Vec3 } from '../math/Vec3'
import type { Body } from '../objects/Body'

/**
 * Constrains the slipping in a contact along a tangent
 */
export class FrictionEquation extends Equation {
  ri: Vec3
  rj: Vec3
  t: Vec3 // Tangent

  /**
   * @param slipForce should be +-F_friction = +-mu * F_normal = +-mu * m * g
   */
  constructor(bodyA: Body, bodyB: Body, slipForce: number) {
    super(bodyA, bodyB, -slipForce, slipForce)
    this.ri = new Vec3()
    this.rj = new Vec3()
    this.t = new Vec3()
  }

  computeB(h: number): number {
    const a = this.a
    const b = this.b
    const bi = this.bi
    const bj = this.bj
    const ri = this.ri
    const rj = this.rj
    const rixt = FrictionEquation_computeB_temp1
    const rjxt = FrictionEquation_computeB_temp2
    const t = this.t

    // Caluclate cross products
    ri.cross(t, rixt)
    rj.cross(t, rjxt)

    // G = [-t -rixt t rjxt]
    // And remember, this is a pure velocity constraint, g is always zero!
    const GA = this.jacobianElementA

    const GB = this.jacobianElementB
    t.negate(GA.spatial)
    rixt.negate(GA.rotational)
    GB.spatial.copy(t)
    GB.rotational.copy(rjxt)

    const GW = this.computeGW()
    const GiMf = this.computeGiMf()

    const B = -GW * b - h * GiMf

    return B
  }
}

const FrictionEquation_computeB_temp1 = new Vec3()
const FrictionEquation_computeB_temp2 = new Vec3()
