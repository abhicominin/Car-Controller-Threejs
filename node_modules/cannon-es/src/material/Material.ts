export type MaterialOptions = ConstructorParameters<typeof Material>[0]

/**
 * Defines a physics material.
 */
export class Material {
  /**
   * Material name.
   * If options is a string, name will be set to that string.
   * @todo Deprecate this
   */
  name: string
  /** Material id. */
  id: number
  /**
   * Friction for this material.
   * If non-negative, it will be used instead of the friction given by ContactMaterials. If there's no matching ContactMaterial, the value from `defaultContactMaterial` in the World will be used.
   */
  friction: number
  /**
   * Restitution for this material.
   * If non-negative, it will be used instead of the restitution given by ContactMaterials. If there's no matching ContactMaterial, the value from `defaultContactMaterial` in the World will be used.
   */
  restitution: number

  static idCounter = 0

  constructor(
    options:
      | {
          /**
           * Friction for this material.
           * If non-negative, it will be used instead of the friction given by ContactMaterials. If there's no matching ContactMaterial, the value from `defaultContactMaterial` in the World will be used.
           */
          friction?: number
          /**
           * Restitution for this material.
           * If non-negative, it will be used instead of the restitution given by ContactMaterials. If there's no matching ContactMaterial, the value from `defaultContactMaterial` in the World will be used.
           */
          restitution?: number
        }
      | string = {}
  ) {
    let name = ''

    // Backwards compatibility fix
    if (typeof options === 'string') {
      //console.warn(`Passing a string to MaterialOptions is deprecated, and has no effect`)
      name = options
      options = {}
    }

    this.name = name
    this.id = Material.idCounter++
    this.friction = typeof options.friction !== 'undefined' ? options.friction : -1
    this.restitution = typeof options.restitution !== 'undefined' ? options.restitution : -1
  }
}
