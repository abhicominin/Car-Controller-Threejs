import { Constraint } from '../constraints/Constraint'
import { ContactEquation } from '../equations/ContactEquation'
import { Vec3 } from '../math/Vec3'
import type { Body } from '../objects/Body'

/**
 * Connects two bodies at given offset points.
 * @example
 *     const bodyA = new Body({ mass: 1 })
 *     const bodyB = new Body({ mass: 1 })
 *     bodyA.position.set(-1, 0, 0)
 *     bodyB.position.set(1, 0, 0)
 *     bodyA.addShape(shapeA)
 *     bodyB.addShape(shapeB)
 *     world.addBody(bodyA)
 *     world.addBody(bodyB)
 *     const localPivotA = new Vec3(1, 0, 0)
 *     const localPivotB = new Vec3(-1, 0, 0)
 *     const constraint = new PointToPointConstraint(bodyA, localPivotA, bodyB, localPivotB)
 *     world.addConstraint(constraint)
 */
export class PointToPointConstraint extends Constraint {
  /**
   * Pivot, defined locally in bodyA.
   */
  pivotA: Vec3
  /**
   * Pivot, defined locally in bodyB.
   */
  pivotB: Vec3

  equationX: ContactEquation
  equationY: ContactEquation
  equationZ: ContactEquation

  /**
   * @param pivotA The point relative to the center of mass of bodyA which bodyA is constrained to.
   * @param bodyB Body that will be constrained in a similar way to the same point as bodyA. We will therefore get a link between bodyA and bodyB. If not specified, bodyA will be constrained to a static point.
   * @param pivotB The point relative to the center of mass of bodyB which bodyB is constrained to.
   * @param maxForce The maximum force that should be applied to constrain the bodies.
   */
  constructor(
    bodyA: Body,

    pivotA = new Vec3(),

    bodyB: Body,

    pivotB = new Vec3(),

    maxForce = 1e6
  ) {
    super(bodyA, bodyB)

    this.pivotA = pivotA.clone()
    this.pivotB = pivotB.clone()

    const x = (this.equationX = new ContactEquation(bodyA, bodyB))
    const y = (this.equationY = new ContactEquation(bodyA, bodyB))
    const z = (this.equationZ = new ContactEquation(bodyA, bodyB))

    // Equations to be fed to the solver
    this.equations.push(x, y, z)

    // Make the equations bidirectional
    x.minForce = y.minForce = z.minForce = -maxForce
    x.maxForce = y.maxForce = z.maxForce = maxForce

    x.ni.set(1, 0, 0)
    y.ni.set(0, 1, 0)
    z.ni.set(0, 0, 1)
  }

  update(): void {
    const bodyA = this.bodyA
    const bodyB = this.bodyB
    const x = this.equationX
    const y = this.equationY
    const z = this.equationZ

    // Rotate the pivots to world space
    bodyA.quaternion.vmult(this.pivotA, x.ri)
    bodyB.quaternion.vmult(this.pivotB, x.rj)

    y.ri.copy(x.ri)
    y.rj.copy(x.rj)
    z.ri.copy(x.ri)
    z.rj.copy(x.rj)
  }
}
