import { Utils } from '../utils/Utils'
import type { Material } from '../material/Material'

export type ContactMaterialOptions = ConstructorParameters<typeof ContactMaterial>[2]

/**
 * Defines what happens when two materials meet.
 * @todo Refactor materials to materialA and materialB
 */
export class ContactMaterial {
  /**
   * Identifier of this material.
   */
  id: number
  /**
   * Participating materials.
   */
  materials: [Material, Material]
  /**
   * Friction coefficient.
   * @default 0.3
   */
  friction: number
  /**
   * Restitution coefficient.
   * @default 0.3
   */
  restitution: number
  /**
   * Stiffness of the produced contact equations.
   * @default 1e7
   */
  contactEquationStiffness: number
  /**
   * Relaxation time of the produced contact equations.
   * @default 3
   */
  contactEquationRelaxation: number
  /**
   * Stiffness of the produced friction equations.
   * @default 1e7
   */
  frictionEquationStiffness: number
  /**
   * Relaxation time of the produced friction equations
   * @default 3
   */
  frictionEquationRelaxation: number

  static idCounter = 0

  constructor(
    m1: Material,
    m2: Material,
    options: {
      /**
       * Friction coefficient.
       * @default 0.3
       */
      friction?: number
      /**
       * Restitution coefficient.
       * @default 0.3
       */
      restitution?: number
      /**
       * Stiffness of the produced contact equations.
       * @default 1e7
       */
      contactEquationStiffness?: number
      /**
       * Relaxation time of the produced contact equations.
       * @default 3
       */
      contactEquationRelaxation?: number
      /**
       * Stiffness of the produced friction equations.
       * @default 1e7
       */
      frictionEquationStiffness?: number
      /**
       * Relaxation time of the produced friction equations
       * @default 3
       */
      frictionEquationRelaxation?: number
    }
  ) {
    options = Utils.defaults(options, {
      friction: 0.3,
      restitution: 0.3,
      contactEquationStiffness: 1e7,
      contactEquationRelaxation: 3,
      frictionEquationStiffness: 1e7,
      frictionEquationRelaxation: 3,
    })

    this.id = ContactMaterial.idCounter++
    this.materials = [m1, m2]
    this.friction = options.friction!
    this.restitution = options.restitution!
    this.contactEquationStiffness = options.contactEquationStiffness!
    this.contactEquationRelaxation = options.contactEquationRelaxation!
    this.frictionEquationStiffness = options.frictionEquationStiffness!
    this.frictionEquationRelaxation = options.frictionEquationRelaxation!
  }
}
