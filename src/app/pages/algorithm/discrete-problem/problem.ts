import random from 'lodash/random';
import { RandomSampleAlgorithms, RandomSampleAlgorithmName } from '../random-sample/random-sample';

const minCost = 1;
const maxCost = 255

export const WeightDistribution: {[key in RandomSampleAlgorithmName ]: () => number} = {
  // "Uniform": () =>  Math.ceil((1 - Math.random()) * maxCost),
  "Uniform": () => {
    const f = RandomSampleAlgorithms["Uniform"](254)
    return Math.ceil(f())
  },
  "Bernoulli": () => {
    const f = RandomSampleAlgorithms["Bernoulli"](0.7);
    return f() === 0 ? minCost: maxCost
  },
  "Normal": () => {
    const f = RandomSampleAlgorithms["Normal"](60, 100);
    return Math.max(1, Math.min(255, Math.ceil(f())))
  },
  "Exponential": () => {
    const f = RandomSampleAlgorithms["Exponential"](0.015)
    return Math.max(1, Math.min(255, Math.ceil(f())))
  },
  "Poisson": () => {
    const f = RandomSampleAlgorithms["Poisson"](5)
    return Math.max(1, Math.min(255, Math.ceil(f())))
  }
}

export class Problem {
  private readonly config: ProblemConfig;

  private readonly init: ProblemNode = { x: 0, y: 0, cost: 0, state: NodeState.Init, estimatedCost: 0};
  private readonly goal: ProblemNode = { x: 0, y: 0, cost: 0, state: NodeState.Goal, estimatedCost: 0};
  private readonly nodes: ProblemNode[][] = [[]];
  private readonly initialState: ProblemNode[][] = [[]]

  constructor(config: ProblemConfig) {
    this.config = config;
    for (let row = 0; row < config.rows; row++) {
      this.nodes[row] = []
      for (let column = 0; column < config.columns; column++) {
        const cost = this.randomCost()
        this.nodes[row][column] = { x: column, y: row, state: NodeState.Unknown, cost: cost, estimatedCost: 0}
      }
    }

    this.init = this.getRandomEmptyNode();
    this.init.cost = 1;
    this.mark(this.init, NodeState.Init);

    this.goal = this.getRandomEmptyNode();
    this.goal.cost = 1;
    this.mark(this.goal, NodeState.Goal);

    this.initialState = this.getNodes();
  }

  getConfig(): ProblemConfig {
    return this.config;
  }

  getInitNode(): ProblemNode {
    return this.init;
  }

  getGoalNode(): ProblemNode {
    return this.goal
  }

  isGoal(node: ProblemNode): boolean {
    if (this.goal.x === node.x && this.goal.y === node.y) {
      this.markPath(node, NodeState.Solution);
      return true
    } else {
      return false;
    }
  }

  expand(node: ProblemNode): ProblemNode[] {
    const allNeighbours = [
      {y: node.y - 1, x: node.x},
      {y: node.y, x: node.x + 1},
      {y: node.y + 1, x: node.x},
      {y: node.y, x: node.x - 1},
    ]
    const neighbours: ProblemNode[] = [];
    for (let n of allNeighbours) {
      const neighbour = this.getNode(n.x, n.y)
      if (neighbour && neighbour.cost < maxCost * 0.8) {
        const neighbourCopy = {
          ...neighbour,
          parent: node,
          cost: node.cost + neighbour.cost,
        };
        neighbours.push(neighbourCopy);
        this.mark(neighbour, NodeState.Pending);
      }
    }
    this.mark(node, NodeState.Visited);
    return neighbours
  }

  reset(): void {
    for (let row = 0; row < this.config.rows; row++) {
      for (let column = 0; column < this.config.columns; column++) {
        this.nodes[row][column] = {
          ...this.initialState[row][column]
        };
      }
    }
  }

  getNodes(): ProblemNode[][] {
    // return a copy, for angular state tracking
    let ret: ProblemNode[][] = []
    for (let row = 0; row < this.config.rows; row++) {
      ret[row] = []
      for (let column = 0; column < this.config.columns; column++) {
        ret[row][column] = {
          ...this.nodes[row][column]
        };
      }
    }
    return ret;
  }

  private randomCost(): number {
    if (WeightDistribution.hasOwnProperty(this.config.weightDistribution)) {
      return WeightDistribution[this.config.weightDistribution]()
    } else {
      throw new Error(`Unsupported weight distribution: ${this.config.weightDistribution}`);
    }
  }

  private getRandomEmptyNode(): ProblemNode {
    let x, y;
    let node: ProblemNode;
    do {
      [x, y] = [random(0, this.config.columns - 1), random(0, this.config.rows - 1)];
      node = this.nodes[y][x];
    } while (node.state === NodeState.Init || node.cost === NodeState.Goal);

    return node;
  }

  private mark(n: ProblemNode, state: NodeState): boolean {
    if (this.nodes[n.y][n.x].state < state) {
      this.nodes[n.y][n.x].state = state;
      return true;
    } else {
      return false;
    }
  }

  private markPath(node: ProblemNode, state: NodeState) {
    while (node.parent) {
      this.mark(node, state);
      node = node.parent;
    }
  }

  private getNode(x: number, y: number): ProblemNode | undefined {
    const inBound = (0 <= x && x < this.config.columns) && (0 <= y && y < this.config.rows)
    return inBound ? this.nodes[y][x] : undefined;
  }
}

export interface ProblemConfig {
  rows: number,
  columns: number,
  weightDistribution: RandomSampleAlgorithmName,
}

export enum NodeState {
  Unknown,
  Pending,
  Visited,
  Solution,
  Init,
  Goal,
}

export interface ProblemNode {
  x: number,
  y: number,
  state: NodeState,
  cost: number,
  estimatedCost: number,
  parent?: ProblemNode,
}
