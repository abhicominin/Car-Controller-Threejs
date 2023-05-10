import { Utils } from '../utils/Utils'
import type { Body } from '../objects/Body'
import type { Equation } from '../equations/Equation'

export type ConstraintOptions = ConstructorParameters<typeof Constraint>[2]

/**
 * Constraint base class
 */
export class Constraint {
  /**
   * Equations to be solved in this constraint.
   */
  equations: Equation[]
  /**
   * Body A.
   */
  bodyA: Body
  /**
   * Body B.
   */
  bodyB: Body
  id: number
  /**
   * Set to false if you don't want the bodies to collide when they are connected.
   */
  collideConnected: boolean

  static idCounter = 0

  constructor(
    bodyA: Body,
    bodyB: Body,
    options: {
      /**
       * Set to false if you don't want the bodies to collide when they are connected.
       * @default true
       */
      collideConnected?: boolean
      /**
       * Set to false if you don't want the bodies to wake up when they are connected.
       * @default true
       */
      wakeUpBodies?: boolean
    } = {}
  ) {
    options = Utils.defaults(options, {
      collideConnected: true,
      wakeUpBodies: true,
    })

    this.equations = []
    this.bodyA = bodyA
    this.bodyB = bodyB
    this.id = Constraint.idCounter++
    this.collideConnected = options.collideConnected!

    if (options.wakeUpBodies) {
      if (bodyA) {
        bodyA.wakeUp()
      }
      if (bodyB) {
        bodyB.wakeUp()
      }
    }
  }

  /**
   * Update all the equations with data.
   */
  update(): void {
    throw new Error('method update() not implmemented in this Constraint subclass!')
  }

  /**
   * Enables all equations in the constraint.
   */
  enable(): void {
    const eqs = this.equations
    for (let i = 0; i < eqs.length; i++) {
      eqs[i].enabled = true
    }
  }

  /**
   * Disables all equations in the constraint.
   */
  disable(): void {
    const eqs = this.equations
    for (let i = 0; i < eqs.length; i++) {
      eqs[i].enabled = false
    }
  }
}
