import {MinPriorityQueue} from "@datastructures-js/priority-queue";
import {PathSearchAlgorithm, Result} from "./path-search";
import {Cell, CellState, Map} from "../../map/map";

export class AStarSearch implements PathSearchAlgorithm {
  static readonly Name = "A* Search";

  private explored: Cell[][] = [];

  private readonly toExplore: MinPriorityQueue<Cell> = new MinPriorityQueue(a => a.cost + a.estimatedCost);

  private result: Result = {
    name: AStarSearch.Name,
    solution: undefined,
    steps: [],
    expanded: 0,
    pending: 0
  };

  constructor(private map: Map) {}

  run(): Result {
    if (this.map.getDestinations().length !== 2) {
      throw new Error("Expecting 2 destinations");
    }

    const [init, goal] = this.map.getDestinations();
    this.addToPending(init);
    while (!this.toExplore.isEmpty()) {
      const node = this.getNextCellToExplore();

      if (this.foundGoal(node, goal)) {
        return {
          ...this.result,
          solution: node,
          pending: this.toExplore.size()
        };
      }
      for (const neighbour of this.map.expand(node)) {
        const {x, y} = neighbour;
        neighbour.estimatedCost = this.estimateCost(neighbour, goal);
        if (this.getExplored(x, y) == undefined || (<Cell> this.getExplored(x, y)).cost > neighbour.cost) {
          this.addToPending(neighbour);
        } else {
          const lastVisit = this.getExplored(x, y) as Cell;
          const lastEstimatedTotalCost = lastVisit.cost + lastVisit.estimatedCost;
          const currentEstimatedTotalCost = neighbour.cost + neighbour.estimatedCost;
          if (lastEstimatedTotalCost > currentEstimatedTotalCost) {
            this.addToPending(neighbour);
          }
        }
      }

      this.map.markPath(node, CellState.Expanded);
    }

    this.result.steps.push(this.map.cloneGrid());
    return {
      name: AStarSearch.Name,
      solution: undefined,
      steps: this.result.steps,
      expanded: this.result.expanded,
      pending: this.toExplore.size()
    };
  }

  private getNextCellToExplore() {
    const node = this.toExplore.pop() as Cell;
    this.map.markPath(node, CellState.Exploring);
    this.result.steps.push(this.map.cloneGrid());
    return node;
  }

  private foundGoal(node: Cell, goal: Cell): boolean {
    if (node.x === goal.x && node.y === goal.y) {
      this.result.steps.push(this.map.cloneGrid());
      this.map.markPath(node, CellState.Solution);
      return true;
    }
    return false;
  }

  private estimateCost(node: Cell, goal: Cell): number {
    return Math.abs(node.y - goal.y) + Math.abs(node.x - goal.x);
  }

  private addToPending(n: Cell) {
    this.toExplore.push(n);
    this.addToExplored(n);
    this.result.expanded += 1;
    this.map.mark(n, CellState.Pending);
  }

  private addToExplored(node: Cell) {
    if (!this.explored[node.y]) {
      this.explored[node.y] = [];
    }
    this.explored[node.y][node.x] = node;
  }

  private getExplored(x: number, y: number): Cell | undefined {
    return this.explored?.[y]?.[x];
  }
}
