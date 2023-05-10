import { PointToPointConstraint } from '../constraints/PointToPointConstraint'
import { RotationalEquation } from '../equations/RotationalEquation'
import { RotationalMotorEquation } from '../equations/RotationalMotorEquation'
import { Vec3 } from '../math/Vec3'
import type { Body } from '../objects/Body'

export type HingeConstraintOptions = ConstructorParameters<typeof HingeConstraint>[2]

/**
 * Hinge constraint. Think of it as a door hinge. It tries to keep the door in the correct place and with the correct orientation.
 */
export class HingeConstraint extends PointToPointConstraint {
  /**
   * Rotation axis, defined locally in bodyA.
   */
  axisA: Vec3
  /**
   * Rotation axis, defined locally in bodyB.
   */
  axisB: Vec3

  rotationalEquation1: RotationalEquation
  rotationalEquation2: RotationalEquation
  motorEquation: RotationalMotorEquation

  constructor(
    bodyA: Body,
    bodyB: Body,
    options: {
      /**
       * A point defined locally in bodyA. This defines the offset of axisA.
       */
      pivotA?: Vec3
      /**
       * A point defined locally in bodyB. This defines the offset of axisB.
       */
      pivotB?: Vec3
      /**
       * An axis that bodyA can rotate around, defined locally in bodyA.
       */
      axisA?: Vec3
      /**
       * An axis that bodyB can rotate around, defined locally in bodyB.
       */
      axisB?: Vec3
      /**
       * Wheter to collide the connected bodies or not.
       * @default false
       */
      collideConnected?: boolean
      /**
       * The maximum force that should be applied to constrain the bodies.
       * @default 1e6
       */
      maxForce?: number
    } = {}
  ) {
    const maxForce = typeof options.maxForce !== 'undefined' ? options.maxForce : 1e6
    const pivotA = options.pivotA ? options.pivotA.clone() : new Vec3()
    const pivotB = options.pivotB ? options.pivotB.clone() : new Vec3()

    super(bodyA, pivotA, bodyB, pivotB, maxForce)

    const axisA = (this.axisA = options.axisA ? options.axisA.clone() : new Vec3(1, 0, 0))
    axisA.normalize()

    const axisB = (this.axisB = options.axisB ? options.axisB.clone() : new Vec3(1, 0, 0))
    axisB.normalize()

    this.collideConnected = !!options.collideConnected

    const rotational1 = (this.rotationalEquation1 = new RotationalEquation(bodyA, bodyB, options))
    const rotational2 = (this.rotationalEquation2 = new RotationalEquation(bodyA, bodyB, options))
    const motor = (this.motorEquation = new RotationalMotorEquation(bodyA, bodyB, maxForce))
    motor.enabled = false // Not enabled by default

    // Equations to be fed to the solver
    this.equations.push(rotational1, rotational2, motor)
  }

  /**
   * enableMotor
   */
  enableMotor(): void {
    this.motorEquation.enabled = true
  }

  /**
   * disableMotor
   */
  disableMotor(): void {
    this.motorEquation.enabled = false
  }

  /**
   * setMotorSpeed
   */
  setMotorSpeed(speed: number): void {
    this.motorEquation.targetVelocity = speed
  }

  /**
   * setMotorMaxForce
   */
  setMotorMaxForce(maxForce: number): void {
    this.motorEquation.maxForce = maxForce
    this.motorEquation.minForce = -maxForce
  }

  /**
   * update
   */
  update(): void {
    const bodyA = this.bodyA
    const bodyB = this.bodyB
    const motor = this.motorEquation
    const r1 = this.rotationalEquation1
    const r2 = this.rotationalEquation2
    const worldAxisA = HingeConstraint_update_tmpVec1
    const worldAxisB = HingeConstraint_update_tmpVec2

    const axisA = this.axisA
    const axisB = this.axisB

    super.update()

    // Get world axes
    bodyA.quaternion.vmult(axisA, worldAxisA)
    bodyB.quaternion.vmult(axisB, worldAxisB)

    worldAxisA.tangents(r1.axisA, r2.axisA)
    r1.axisB.copy(worldAxisB)
    r2.axisB.copy(worldAxisB)

    if (this.motorEquation.enabled) {
      bodyA.quaternion.vmult(this.axisA, motor.axisA)
      bodyB.quaternion.vmult(this.axisB, motor.axisB)
    }
  }
}

const HingeConstraint_update_tmpVec1 = new Vec3()
const HingeConstraint_update_tmpVec2 = new Vec3()
