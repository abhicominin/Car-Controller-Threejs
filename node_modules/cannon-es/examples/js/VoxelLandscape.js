import * as CANNON from '../../dist/cannon-es.js'

/**
 * @author schteppe / https://github.com/schteppe
 */
class VoxelLandscape {
  map = []
  boxified = []
  boxes = []

  constructor(world, nx, ny, nz, sx, sy, sz) {
    this.nx = nx
    this.ny = ny
    this.nz = nz

    this.sx = sx
    this.sy = sy
    this.sz = sz

    this.world = world

    this.boxShape = new CANNON.Box(new CANNON.Vec3(sx * 0.5, sy * 0.5, sz * 0.5))

    // Prepare map
    for (var i = 0; i < nx; i++) {
      for (var j = 0; j < ny; j++) {
        for (var k = 0; k < nz; k++) {
          this.map.push(true)
          this.boxified.push(false)
        }
      }
    }

    // User must manually update the map for the first time,
    // after setting or not the filled
  }

  getBoxIndex(xi, yi, zi) {
    const nx = this.nx
    const ny = this.ny
    const nz = this.nz

    if (xi >= 0 && xi < nx && yi >= 0 && yi < ny && zi >= 0 && zi < nz) {
      return xi + nx * yi + nx * ny * zi
    } else {
      return -1
    }
  }

  setFilled(xi, yi, zi, filled) {
    const i = this.getBoxIndex(xi, yi, zi)
    if (i !== -1) {
      this.map[i] = Boolean(filled)
    }
  }

  isFilled(xi, yi, zi) {
    const i = this.getBoxIndex(xi, yi, zi)
    if (i !== -1) {
      return this.map[i]
    } else {
      return false
    }
  }

  isBoxified(xi, yi, zi) {
    const i = this.getBoxIndex(xi, yi, zi)
    if (i !== -1) {
      return this.boxified[i]
    } else {
      return false
    }
  }

  setBoxified(xi, yi, zi, boxified) {
    this.boxified[this.getBoxIndex(xi, yi, zi)] = Boolean(boxified)
    return Boolean(boxified)
  }

  // Updates "boxes"
  update() {
    const nx = this.nx
    const ny = this.ny
    const nz = this.nz

    // Remove all old boxes
    for (let i = 0; i < this.boxes.length; i++) {
      world.removeBody(this.boxes[i])
    }
    this.boxes.length = 0

    // Set whole map to unboxified
    for (let i = 0; i < this.boxified.length; i++) {
      this.boxified[i] = false
    }

    while (true) {
      let box

      // 1. Get a filled box that we haven't boxified yet
      for (let i = 0; !box && i < nx; i++) {
        for (let j = 0; !box && j < ny; j++) {
          for (let k = 0; !box && k < nz; k++) {
            if (this.isFilled(i, j, k) && !this.isBoxified(i, j, k)) {
              box = new CANNON.Body({ mass: 0 })
              box.xi = i // Position
              box.yi = j
              box.zi = k
              box.nx = 0 // Size
              box.ny = 0
              box.nz = 0
              this.boxes.push(box)
            }
          }
        }
      }

      // 2. Check if we can merge it with its neighbors
      if (box) {
        // Check what can be merged
        const xi = box.xi
        const yi = box.yi
        const zi = box.zi

        // merge=1 means merge just with the self box
        box.nx = nx
        box.ny = ny
        box.nz = nz

        // Merge in x
        for (let i = xi; i < nx + 1; i++) {
          if (!this.isFilled(i, yi, zi) || (this.isBoxified(i, yi, zi) && this.getBoxIndex(i, yi, zi) !== -1)) {
            // Can't merge this box. Make sure we limit the mergeing
            box.nx = i - xi
            break
          }
        }

        // Merge in y
        let found = false
        for (let i = xi; !found && i < xi + box.nx; i++) {
          for (let j = yi; !found && j < ny + 1; j++) {
            if (!this.isFilled(i, j, zi) || (this.isBoxified(i, j, zi) && this.getBoxIndex(i, j, zi) !== -1)) {
              // Can't merge this box. Make sure we limit the mergeing
              if (box.ny > j - yi) box.ny = j - yi
            }
          }
        }

        // Merge in z
        found = false
        for (let i = xi; !found && i < xi + box.nx; i++) {
          for (let j = yi; !found && j < yi + box.ny; j++) {
            for (let k = zi; k < nz + 1; k++) {
              if (!this.isFilled(i, j, k) || (this.isBoxified(i, j, k) && this.getBoxIndex(i, j, k) !== -1)) {
                // Can't merge this box. Make sure we limit the mergeing
                if (box.nz > k - zi) box.nz = k - zi
              }
            }
          }
        }

        if (box.nx == 0) box.nx = 1
        if (box.ny == 0) box.ny = 1
        if (box.nz == 0) box.nz = 1

        // Set the merged boxes as boxified
        for (let i = xi; i < xi + box.nx; i++) {
          for (let j = yi; j < yi + box.ny; j++) {
            for (let k = zi; k < zi + box.nz; k++) {
              if (i >= xi && i <= xi + box.nx && j >= yi && j <= yi + box.ny && k >= zi && k <= zi + box.nz) {
                this.setBoxified(i, j, k, true)
              }
            }
          }
        }

        box = false
      } else {
        break
      }
    }

    // Set box positions
    const sx = this.sx
    const sy = this.sy
    const sz = this.sz

    for (let i = 0; i < this.boxes.length; i++) {
      const box = this.boxes[i]
      box.position.set(
        box.xi * sx + box.nx * sx * 0.5,
        box.yi * sy + box.ny * sy * 0.5,
        box.zi * sz + box.nz * sz * 0.5
      )

      // Replace box shapes
      box.addShape(new CANNON.Box(new CANNON.Vec3(box.nx * sx * 0.5, box.ny * sy * 0.5, box.nz * sz * 0.5)))
      // box.aabbNeedsUpdate = true
      this.world.addBody(box)
      // this.boxes.push(box)
    }
  }
}

export { VoxelLandscape }
