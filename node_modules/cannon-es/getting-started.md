# Getting Started

**cannon-es** is a lightweight and easy to use 3D physics engine for the web.
It is inspired by the [three.js](https://github.com/mrdoob/three.js/)' simple API, and based upon [ammo.js](https://github.com/kripken/ammo.js/) and the [Bullet physics engine](https://github.com/bulletphysics/bullet3).

The first thing to set up is our physics world, which will hold all of our physics bodies and step the simulation forward.

Let's create a world with Earth's gravity. Note that cannon.js uses [SI units](https://en.wikipedia.org/wiki/International_System_of_Units) (metre, kilogram, second, etc.).

```js
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
})
```

To step the simulation forward, we have to call **`world.step()`** each frame.
As a first argument we pass the fixed timestep at which we want the simulation to run, `1 / 60` means 60fps.
As a second argument, we pass the elapsed time since the last `.step()` call. This is used to keep the simulation at the same speed independently of the framerate, since `requestAnimationFrame` calls may vary on different devices or there might be performance issues. [Read more about fixed simulation stepping here](https://gafferongames.com/post/fix_your_timestep/).

```js
const timeStep = 1 / 60 // seconds
let lastCallTime
function animate() {
  requestAnimationFrame(animate)

  const time = performance.now() / 1000 // seconds
  if (!lastCallTime) {
    world.step(timeStep)
  } else {
    const dt = time - lastCallTime
    world.step(timeStep, dt)
  }
  lastCallTime = time
}
// Start the simulation loop
animate()
```

Rigid Bodies are the entities which will be simulated in the world, they can be simple shapes such as [Sphere](classes/sphere), [Box](classes/box), [Plane](classes/plane), [Cylinder](classes/cylinder), or more complex shapes such as [ConvexPolyhedron](classes/convexpolyhedron), [Particle](classes/particle), [Heightfield](classes/heightfield), [Trimesh](classes/trimesh).

Let's create a basic sphere body.

```js
const radius = 1 // m
const sphereBody = new CANNON.Body({
  mass: 5, // kg
  shape: new CANNON.Sphere(radius),
})
sphereBody.position.set(0, 10, 0) // m
world.addBody(sphereBody)
```

As you can see we specified a **mass** property, the mass defines behaviour of the body when being affected by forces.

When bodies have a mass and are affected by forces, they're called **Dynamic** bodies. There are also **Kinematic** bodies which aren't affected by forces but can have a velocity and move around. The third type of bodies are **Static** bodies which can only be positioned in the world and aren't affected by forces nor velocity.

If you pass a mass of 0 to a body, that body is automatically flagged as a static body. You can also explicit the body type in the body options. Let's create a static ground for example.

```js
const groundBody = new CANNON.Body({
  type: Body.STATIC,
  shape: new CANNON.Plane(),
})
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
world.addBody(groundBody)
```

Here are all the previous snippets combined in a fully working example.

```js
import * as CANNON from 'cannon-es'

// Setup our physics world
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
})

// Create a sphere body
const radius = 1 // m
const sphereBody = new CANNON.Body({
  mass: 5, // kg
  shape: new CANNON.Sphere(radius),
})
sphereBody.position.set(0, 10, 0) // m
world.addBody(sphereBody)

// Create a static plane for the ground
const groundBody = new CANNON.Body({
  type: Body.STATIC, // can also be achieved by setting the mass to 0
  shape: new CANNON.Plane(),
})
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
world.addBody(groundBody)

// Start the simulation loop
const timeStep = 1 / 60 // seconds
let lastCallTime
function animate() {
  requestAnimationFrame(animate)

  const time = performance.now() / 1000 // seconds
  if (!lastCallTime) {
    world.step(timeStep)
  } else {
    const dt = time - lastCallTime
    world.step(timeStep, dt)
  }
  lastCallTime = time

  // the sphere y position shows the sphere falling
  console.log(`Sphere y position: ${sphereBody.position.y}`)
}
animate()
```

Note that **cannon doesn't take care of rendering anything to the screen**, it just computes the math of the simulation. To actually show something to the screen you have to use rendering libraries such as [three.js](https://github.com/mrdoob/three.js/). Let's see how we can achieve that.

First of all, you have to create the body's correspondent entity in three.js. For example here is how you create a sphere in three.js.

```js
const radius = 1 // m
const geometry = new THREE.SphereGeometry(radius)
const material = new THREE.MeshNormalMaterial()
const sphereMesh = new THREE.Mesh(geometry, material)
scene.add(sphereMesh)
```

Then, you have to wire up the three.js mesh with the cannon.js body. To do that, you copy the positional and rotational data from the body to the mesh each frame after having stepped the world.

```js
function animate() {
  requestAnimationFrame(animate)

  // world stepping...

  sphereMesh.position.copy(sphereBody.position)
  sphereMesh.quaternion.copy(sphereBody.quaternion)

  // three.js render...
}
animate()
```

You should now see a falling ball on the screen! Check out the [basic three.js example](https://github.com/pmndrs/cannon-es/blob/master/examples/threejs.html) for the full code.

That's it for the basic example, to learn more about all the different features, head over to the [examples page](https://pmndrs.github.io/cannon-es/)!
