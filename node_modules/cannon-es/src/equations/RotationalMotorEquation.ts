import { Equation } from '../equations/Equation'
import { Vec3 } from '../math/Vec3'
import type { Body } from '../objects/Body'

/**
 * Rotational motor constraint. Tries to keep the relative angular velocity of the bodies to a given value.
 */
export class RotationalMotorEquation extends Equation {
  /**
   * World oriented rotational axis.
   */
  axisA: Vec3
  /**
   * World oriented rotational axis.
   */
  axisB: Vec3
  /**
   * Motor velocity.
   */
  targetVelocity: number

  constructor(bodyA: Body, bodyB: Body, maxForce = 1e6) {
    super(bodyA, bodyB, -maxForce, maxForce)

    this.axisA = new Vec3()
    this.axisB = new Vec3()
    this.targetVelocity = 0
  }

  computeB(h: number): number {
    const a = this.a
    const b = this.b
    const bi = this.bi
    const bj = this.bj
    const axisA = this.axisA
    const axisB = this.axisB
    const GA = this.jacobianElementA
    const GB = this.jacobianElementB

    // g = 0
    // gdot = axisA * wi - axisB * wj
    // gdot = G * W = G * [vi wi vj wj]
    // =>
    // G = [0 axisA 0 -axisB]

    GA.rotational.copy(axisA)
    axisB.negate(GB.rotational)

    const GW = this.computeGW() - this.targetVelocity
    const GiMf = this.computeGiMf()

    const B = -GW * b - h * GiMf

    return B
  }
}
