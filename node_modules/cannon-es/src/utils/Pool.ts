/**
 * For pooling objects that can be reused.
 */
export class Pool {
  /**
   * The objects array.
   */
  objects: any[] = []
  /**
   * The type of the objects.
   */
  type: any = Object

  /**
   * Release an object after use
   */
  release(...args: any[]): Pool {
    const Nargs = args.length
    for (let i = 0; i !== Nargs; i++) {
      this.objects.push(args[i])
    }
    return this
  }

  /**
   * Get an object
   */
  get(): any {
    if (this.objects.length === 0) {
      return this.constructObject()
    } else {
      return this.objects.pop()
    }
  }

  /**
   * Construct an object. Should be implemented in each subclass.
   */
  constructObject(): void {
    throw new Error('constructObject() not implemented in this Pool subclass yet!')
  }

  /**
   * @return Self, for chaining
   */
  resize(size: number): Pool {
    const objects = this.objects

    while (objects.length > size) {
      objects.pop()
    }

    while (objects.length < size) {
      objects.push(this.constructObject())
    }

    return this
  }
}
