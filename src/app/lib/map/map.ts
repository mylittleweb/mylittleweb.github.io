import random from "lodash/random";
import {RandomSampleAlgorithms, RandomSampleAlgorithmName} from "../algo/random-sample/random-sample";

const minCost = 1;
const maxCost = 255;

export const WeightDistribution: {[key in RandomSampleAlgorithmName ]: () => number} = {
  // "Uniform": () =>  Math.ceil((1 - Math.random()) * maxCost),
  Uniform: () => {
    const f = RandomSampleAlgorithms["Uniform"](254);
    return Math.ceil(f());
  },
  Bernoulli: () => {
    const f = RandomSampleAlgorithms["Bernoulli"](0.8);
    return f() === 0 ? minCost : maxCost;
  },
  Normal: () => {
    const f = RandomSampleAlgorithms["Normal"](60, 100);
    return Math.max(1, Math.min(255, Math.ceil(f())));
  },
  Exponential: () => {
    const f = RandomSampleAlgorithms["Exponential"](0.015);
    return Math.max(1, Math.min(255, Math.ceil(f())));
  },
  Poisson: () => {
    const f = RandomSampleAlgorithms["Poisson"](5);
    return Math.max(1, Math.min(255, Math.ceil(f())));
  }
};

export class Map {
  private readonly grid: Grid = [[]];
  private readonly initialGrid: Grid = [[]];
  private readonly destinations: Cell[] = [];

  constructor(private readonly config: MapConfig) {
    this.initGrid();
    this.initDestinationCell();
    this.initialGrid = this.cloneGrid();
  }

  getDestinations(): Cell[] {
    return this.destinations;
  }

  expand(node: Cell): Cell[] {
    const allNeighbours = [
      {y: node.y - 1, x: node.x},
      {y: node.y, x: node.x + 1},
      {y: node.y + 1, x: node.x},
      {y: node.y, x: node.x - 1}
    ];
    const neighbours: Cell[] = [];
    for (const n of allNeighbours) {
      const neighbour = this.getCell(n.x, n.y);
      if (neighbour && neighbour.state !== CellState.Blocker) {
        const neighbourCopy = {
          ...neighbour,
          parent: node,
          cost: node.cost + neighbour.cost
        };
        neighbours.push(neighbourCopy);
      }
    }
    return neighbours;
  }

  reset(): void {
    for (let row = 0; row < this.config.rows; row++) {
      for (let column = 0; column < this.config.columns; column++) {
        this.grid[row][column] = {
          ...this.initialGrid[row][column]
        };
      }
    }
  }

  cloneGrid(): Grid {
    // return a copy, for angular state tracking
    const ret: Cell[][] = [];
    for (let row = 0; row < this.config.rows; row++) {
      ret[row] = [];
      for (let column = 0; column < this.config.columns; column++) {
        ret[row][column] = {
          ...this.grid[row][column]
        };
      }
    }
    return ret;
  }

  markPath(node: Cell, state: CellState) {
    while (node.parent) {
      this.mark(node, state);
      node = node.parent;
    }
  }

  mark(n: Cell, state: CellState) {
    if (n.state !== CellState.Destination) {
      this.grid[n.y][n.x].state = state;
    }
  }

  private initGrid() {
    for (let row = 0; row < this.config.rows; row++) {
      this.grid[row] = [];
      for (let column = 0; column < this.config.columns; column++) {
        const cost = this.randomCost();
        this.grid[row][column] = {x: column,
          y: row,
          state: cost > maxCost * 0.85 ? CellState.Blocker : CellState.Unknown,
          cost: cost,
          estimatedCost: 0};
      }
    }
  }

  private initDestinationCell() {
    for (let d = 0; d < this.config.destinations; d++) {
      const n = this.getRandomEmptyCell();
      n.state = CellState.Destination;
      this.destinations.push(n);
      this.mark(n, CellState.Destination);
    }
  }

  private randomCost(): number {
    if (WeightDistribution[this.config.weightDistribution]) {
      return WeightDistribution[this.config.weightDistribution]();
    } else {
      throw new Error(`Unsupported weight distribution: ${this.config.weightDistribution}`);
    }
  }

  private getRandomEmptyCell(): Cell {
    let x, y;
    let node: Cell;
    do {
      [x, y] = [random(0, this.config.columns - 1), random(0, this.config.rows - 1)];
      node = this.grid[y][x];
    } while (node.state === CellState.Destination || node.state === CellState.Blocker);

    return node;
  }

  private getCell(x: number, y: number): Cell | undefined {
    const inBound = 0 <= x && x < this.config.columns && (0 <= y && y < this.config.rows);
    return inBound ? this.grid[y][x] : undefined;
  }
}

export interface MapConfig {
  rows: number;
  columns: number;
  destinations: number;
  weightDistribution: RandomSampleAlgorithmName;
}

export enum CellState {
  Unknown,
  Exploring,
  Pending,
  Expanded,
  Solution,
  Destination,
  Blocker
}

export interface Cell {
  x: number;
  y: number;
  state: CellState;
  cost: number;
  estimatedCost: number;
  parent?: Cell;
}

export type Grid = Cell[][];
