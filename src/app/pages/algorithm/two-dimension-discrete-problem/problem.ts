import * as _ from 'lodash';

export enum NodeState {
  Unknown,
  Pending,
  Visited,
  Solution,
  Init,
  Goal,
  Blocked
}

export interface ProblemNode {
  x: number,
  y: number,
  cost: number,
  estimatedCost: number,
  parent?: ProblemNode
}

export class Problem {
  private readonly size = { colums: 0, rows: 0};
  private readonly init: ProblemNode = { x: 0, y: 0, cost: 0, estimatedCost: 0};
  private readonly goal: ProblemNode = { x: 0, y: 0, cost: 0, estimatedCost: 0};
  private readonly nodes: NodeState[][] = [[]];

  constructor(columns: number, rows: number, blocker: number) {
    this.size = {colums: columns, rows: rows}
    for (let row = 0; row < rows; row++) {
      this.nodes[row] = []
      for (let column = 0; column < columns; column++) {
        this.nodes[row][column] = NodeState.Unknown
      }
    }

    this.init = this.getRandomEmptyNode();
    this.mark(this.init, NodeState.Init);

    this.goal = this.getRandomEmptyNode();
    this.mark(this.goal, NodeState.Goal);

    for (let i = 0; i < blocker; i++ ) {
      let blockedCell = this.getRandomEmptyNode();
      this.mark(blockedCell, NodeState.Blocked)
    }
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
    const allNeighbours: ProblemNode[] = [
      {y: node.y - 1, x: node.x, cost: 0, estimatedCost: 0},
      {y: node.y, x: node.x + 1, cost: 0, estimatedCost: 0},
      {y: node.y + 1, x: node.x, cost: 0, estimatedCost: 0},
      {y: node.y, x: node.x - 1, cost: 0, estimatedCost: 0},
    ]
    const neighbours: ProblemNode[] = [];
    for (let n of allNeighbours) {
      let inBound = (0 <= n.x && n.x < this.size.colums) && (0 <= n.y && n.y < this.size.rows)
      if (inBound && this.nodes[n.y][n.x] !== NodeState.Blocked) {
        neighbours.push({
          ...n,
          parent: node,
          cost: node.cost + 1
        })

        this.mark(n, NodeState.Pending);
      }
    }

    this.mark(node, NodeState.Visited);
    return neighbours
  }

  getNodesStatus(): NodeState[][] {
    // return a copy, for angular state tracking
    let ret: NodeState[][] = []
    for (let row = 0; row < this.size.rows; row++) {
      ret[row] = []
      for (let column = 0; column < this.size.colums; column++) {
        ret[row][column] = this.nodes[row][column];
      }
    }

    return ret;
  }

  private getRandomEmptyNode(): ProblemNode {
    let [x, y] = [_.random(0, this.size.colums - 1), _.random(0, this.size.rows - 1)];
    while (this.nodes[y][x] !== NodeState.Unknown) {
      [x, y] = [_.random(0, this.size.colums - 1), _.random(0, this.size.rows - 1)];
    }

    return {x: x, y: y, cost: 0, estimatedCost: 0};
  }

  private mark(n: ProblemNode, state: NodeState): boolean {
    if (this.nodes[n.y][n.x] < state) {
      this.nodes[n.y][n.x] = state;
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
}
