import { Constraint } from '../constraints/Constraint'
import { ContactEquation } from '../equations/ContactEquation'
import type { Body } from '../objects/Body'

/**
 * Constrains two bodies to be at a constant distance from each others center of mass.
 */
export class DistanceConstraint extends Constraint {
  /**
   * The distance to keep. If undefined, it will be set to the current distance between bodyA and bodyB
   */
  distance: number
  distanceEquation: ContactEquation

  /**
   * @param distance The distance to keep. If undefined, it will be set to the current distance between bodyA and bodyB.
   * @param maxForce The maximum force that should be applied to constrain the bodies.
   */
  constructor(bodyA: Body, bodyB: Body, distance?: number, maxForce = 1e6) {
    super(bodyA, bodyB)

    if (typeof distance === 'undefined') {
      distance = bodyA.position.distanceTo(bodyB.position)
    }

    this.distance = distance!
    const eq = (this.distanceEquation = new ContactEquation(bodyA, bodyB))
    this.equations.push(eq)

    // Make it bidirectional
    eq.minForce = -maxForce
    eq.maxForce = maxForce
  }

  /**
   * update
   */
  update(): void {
    const bodyA = this.bodyA
    const bodyB = this.bodyB
    const eq = this.distanceEquation
    const halfDist = this.distance * 0.5
    const normal = eq.ni

    bodyB.position.vsub(bodyA.position, normal)
    normal.normalize()
    normal.scale(halfDist, eq.ri)
    normal.scale(-halfDist, eq.rj)
  }
}
