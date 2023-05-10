import { PointToPointConstraint } from '../constraints/PointToPointConstraint'
import { ConeEquation } from '../equations/ConeEquation'
import { RotationalEquation } from '../equations/RotationalEquation'
import { Vec3 } from '../math/Vec3'
import type { Body } from '../objects/Body'

export type ConeTwistConstraintOptions = ConstructorParameters<typeof ConeTwistConstraint>[2]

/**
 * A Cone Twist constraint, useful for ragdolls.
 */
export class ConeTwistConstraint extends PointToPointConstraint {
  /**
   * The axis direction for the constraint of the body A.
   */
  axisA: Vec3
  /**
   * The axis direction for the constraint of the body B.
   */
  axisB: Vec3
  /**
   * The aperture angle of the cone.
   */
  angle: number
  /**
   * The twist angle of the joint.
   */
  twistAngle: number
  coneEquation: ConeEquation
  twistEquation: RotationalEquation

  constructor(
    bodyA: Body,
    bodyB: Body,
    options: {
      /**
       * The pivot point for bodyA.
       */
      pivotA?: Vec3
      /**
       * The pivot point for bodyB.
       */
      pivotB?: Vec3
      /**
       * The axis direction for the constraint of the body A.
       */
      axisA?: Vec3
      /**
       * The axis direction for the constraint of the body B.
       */
      axisB?: Vec3
      /**
       * The aperture angle of the cone.
       * @default 0
       */
      angle?: number
      /**
       * The twist angle of the joint.
       * @default 0
       */
      twistAngle?: number
      /**
       * The maximum force that should be applied to constrain the bodies.
       * @default 1e6
       */
      maxForce?: number
      /**
       * Wether to collide the connected bodies or not.
       * @default false
       */
      collideConnected?: boolean
    } = {}
  ) {
    const maxForce = typeof options.maxForce !== 'undefined' ? options.maxForce : 1e6

    // Set pivot point in between
    const pivotA = options.pivotA ? options.pivotA.clone() : new Vec3()
    const pivotB = options.pivotB ? options.pivotB.clone() : new Vec3()

    super(bodyA, pivotA, bodyB, pivotB, maxForce)

    this.axisA = options.axisA ? options.axisA.clone() : new Vec3()
    this.axisB = options.axisB ? options.axisB.clone() : new Vec3()

    this.collideConnected = !!options.collideConnected

    this.angle = typeof options.angle !== 'undefined' ? options.angle : 0

    const c = (this.coneEquation = new ConeEquation(bodyA, bodyB, options))

    const t = (this.twistEquation = new RotationalEquation(bodyA, bodyB, options))
    this.twistAngle = typeof options.twistAngle !== 'undefined' ? options.twistAngle : 0

    // Make the cone equation push the bodies toward the cone axis, not outward
    c.maxForce = 0
    c.minForce = -maxForce

    // Make the twist equation add torque toward the initial position
    t.maxForce = 0
    t.minForce = -maxForce

    this.equations.push(c, t)
  }

  update(): void {
    const bodyA = this.bodyA
    const bodyB = this.bodyB
    const cone = this.coneEquation
    const twist = this.twistEquation

    super.update()

    // Update the axes to the cone constraint
    bodyA.vectorToWorldFrame(this.axisA, cone.axisA)
    bodyB.vectorToWorldFrame(this.axisB, cone.axisB)

    // Update the world axes in the twist constraint
    this.axisA.tangents(twist.axisA, twist.axisA)
    bodyA.vectorToWorldFrame(twist.axisA, twist.axisA)

    this.axisB.tangents(twist.axisB, twist.axisB)
    bodyB.vectorToWorldFrame(twist.axisB, twist.axisB)

    cone.angle = this.angle
    twist.maxAngle = this.twistAngle
  }
}

const ConeTwistConstraint_update_tmpVec1 = new Vec3()
const ConeTwistConstraint_update_tmpVec2 = new Vec3()
