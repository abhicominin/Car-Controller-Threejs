import type { World } from '../src/world/World'
import type { TestConfig } from './helpers'

type ToBeCollidingRecieved = [World, number, number, boolean]

expect.extend({
  toBeColliding([world, bodyAIndex, bodyBIndex, isFirstStep]: ToBeCollidingRecieved, testConfig: TestConfig) {
    const bodyA = world.bodies[bodyAIndex]
    const bodyB = world.bodies[bodyBIndex]
    const isColliding = isFirstStep
      ? !!world.collisionMatrix.get(bodyA, bodyB)
      : !!world.collisionMatrixPrevious.get(bodyA, bodyB)

    const expected = testConfig.colliding[bodyAIndex + '-' + bodyBIndex] === true

    return {
      pass: isColliding === expected,
      message: () =>
        [
          `${expected ? 'Should be colliding' : 'Should not be colliding'}`,
          `testConfig=${JSON.stringify(testConfig)}`,
          `isFirstStep=${isFirstStep}`,
          `expected=${expected}`,
          `isColliding=${isColliding}`,
          `bodyAIndex=${bodyAIndex}`,
          `bodyBIndex=${bodyBIndex}`,
        ].join(', '),
    }
  },
})
