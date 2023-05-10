import { Solver } from '../solver/Solver'
import { Body } from '../objects/Body'
import type { Equation } from '../equations/Equation'
import type { World } from '../world/World'
import { GSSolver } from './GSSolver'

type SplitSolverNode = { body: Body | null; children: SplitSolverNode[]; eqs: Equation[]; visited: boolean }

/**
 * Splits the equations into islands and solves them independently. Can improve performance.
 */
export class SplitSolver extends Solver {
  /**
   * The number of solver iterations determines quality of the constraints in the world. The more iterations, the more correct simulation. More iterations need more computations though. If you have a large gravity force in your world, you will need more iterations.
   */
  iterations: number

  /**
   * When tolerance is reached, the system is assumed to be converged.
   */
  tolerance: number
  /** subsolver */
  subsolver: GSSolver
  nodes: SplitSolverNode[]
  nodePool: SplitSolverNode[]

  constructor(subsolver: GSSolver) {
    super()

    this.iterations = 10
    this.tolerance = 1e-7
    this.subsolver = subsolver
    this.nodes = []
    this.nodePool = []

    // Create needed nodes, reuse if possible
    while (this.nodePool.length < 128) {
      this.nodePool.push(this.createNode())
    }
  }

  /**
   * createNode
   */
  createNode(): SplitSolverNode {
    return { body: null, children: [], eqs: [], visited: false }
  }

  /**
   * Solve the subsystems
   * @return number of iterations performed
   */
  solve(dt: number, world: World): number {
    const nodes = SplitSolver_solve_nodes
    const nodePool = this.nodePool
    const bodies = world.bodies
    const equations = this.equations
    const Neq = equations.length
    const Nbodies = bodies.length
    const subsolver = this.subsolver

    // Create needed nodes, reuse if possible
    while (nodePool.length < Nbodies) {
      nodePool.push(this.createNode())
    }
    nodes.length = Nbodies
    for (let i = 0; i < Nbodies; i++) {
      nodes[i] = nodePool[i]
    }

    // Reset node values
    for (let i = 0; i !== Nbodies; i++) {
      const node = nodes[i]
      node.body = bodies[i]
      node.children.length = 0
      node.eqs.length = 0
      node.visited = false
    }
    for (let k = 0; k !== Neq; k++) {
      const eq = equations[k]
      const i = bodies.indexOf(eq.bi)
      const j = bodies.indexOf(eq.bj)
      const ni = nodes[i]
      const nj = nodes[j]
      ni.children.push(nj)
      ni.eqs.push(eq)
      nj.children.push(ni)
      nj.eqs.push(eq)
    }

    let child: SplitSolverNode | false
    let n = 0
    let eqs = SplitSolver_solve_eqs

    subsolver.tolerance = this.tolerance
    subsolver.iterations = this.iterations

    const dummyWorld = SplitSolver_solve_dummyWorld
    while ((child = getUnvisitedNode(nodes))) {
      eqs.length = 0
      dummyWorld.bodies.length = 0
      bfs(child, visitFunc, dummyWorld.bodies, eqs)

      const Neqs = eqs.length

      eqs = eqs.sort(sortById)

      for (let i = 0; i !== Neqs; i++) {
        subsolver.addEquation(eqs[i])
      }

      const iter = subsolver.solve(dt, dummyWorld as World)
      subsolver.removeAllEquations()
      n++
    }

    return n
  }
}

// Returns the number of subsystems
const SplitSolver_solve_nodes: SplitSolverNode[] = [] // All allocated node objects
const SplitSolver_solve_nodePool: SplitSolverNode[] = [] // All allocated node objects
const SplitSolver_solve_eqs: Equation[] = [] // Temp array
const SplitSolver_solve_bds: Body[] = [] // Temp array
const SplitSolver_solve_dummyWorld: { bodies: Body[] } = { bodies: [] } // Temp object

const STATIC = Body.STATIC

function getUnvisitedNode(nodes: SplitSolverNode[]): SplitSolverNode | false {
  const Nnodes = nodes.length
  for (let i = 0; i !== Nnodes; i++) {
    const node = nodes[i]
    if (!node.visited && !(node.body!.type & STATIC)) {
      return node
    }
  }
  return false
}

const queue: SplitSolverNode[] = []

function bfs(
  root: SplitSolverNode,
  visitFunc: (node: SplitSolverNode, bds: (Body | null)[], eqs: Equation[]) => void,
  bds: (Body | null)[],
  eqs: Equation[]
): void {
  queue.push(root)
  root.visited = true
  visitFunc(root, bds, eqs)
  while (queue.length) {
    const node = queue.pop()!
    // Loop over unvisited child nodes
    let child: SplitSolverNode | false
    while ((child = getUnvisitedNode(node.children))) {
      child.visited = true
      visitFunc(child, bds, eqs)
      queue.push(child)
    }
  }
}

function visitFunc(node: SplitSolverNode, bds: (Body | null)[], eqs: Equation[]): void {
  bds.push(node.body)
  const Neqs = node.eqs.length
  for (let i = 0; i !== Neqs; i++) {
    const eq = node.eqs[i]
    if (!eqs.includes(eq)) {
      eqs.push(eq)
    }
  }
}

function sortById(a: { id: number }, b: { id: number }): number {
  return b.id - a.id
}
