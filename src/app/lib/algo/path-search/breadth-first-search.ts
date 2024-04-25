import {PathSearchAlgorithm, Result} from "./path-search";
import {Cell, CellState, Map} from "../../map/map";

export class BreadthFirstSearch implements PathSearchAlgorithm {
  static readonly Name = "Breadth First Search";

  private explored: boolean[][] = [];

  private readonly toExplore: Cell[] = [];

  private result: Result = {
    name: BreadthFirstSearch.Name,
    solution: undefined,
    steps: [],
    expanded: 0,
    pending: 0
  };

  constructor(private readonly map: Map) {}

  run(): Result {
    if (this.map.getDestinations().length !== 2) {
      throw new Error("Expecting 2 destinations");
    }

    const [init, goal] = this.map.getDestinations();
    this.addToPending(init);
    while (this.moreToExplore()) {
      const node = this.nextToExplore();

      for (const neighbour of this.map.expand(node)) {
        if (this.foundGoal(neighbour, goal)) {
          return {
            ...this.result,
            solution: neighbour,
            pending: this.toExplore.length
          };
        }
        if (!this.getExplored(neighbour)) {
          this.addToPending(neighbour);
        }
      }

      this.map.markPath(node, CellState.Expanded);
    }

    this.result.steps.push(this.map.cloneGrid());
    return {
      ...this.result,
      solution: undefined,
      pending: this.toExplore.length
    };
  }

  private moreToExplore(): boolean {
    return this.toExplore.length > 0;
  }

  private nextToExplore(): Cell {
    const cell = this.toExplore.shift() as Cell;
    this.map.markPath(cell, CellState.Exploring);
    this.result.steps.push(this.map.cloneGrid());
    return cell;
  }

  private foundGoal(node: Cell, goal: Cell): boolean {
    if (node.x === goal.x && node.y === goal.y) {
      this.map.markPath(node, CellState.Solution);
      this.result.steps.push(this.map.cloneGrid());
      return true;
    }
    return false;
  }

  private addToPending(node: Cell) {
    this.toExplore.push(node);
    this.map.mark(node, CellState.Pending);
    this.result.expanded += 1;
    this.addToExplored(node);
  }

  private addToExplored(node: Cell) {
    if (!this.explored[node.y]) {
      this.explored[node.y] = [];
    }
    this.explored[node.y][node.x] = true;
  }

  private getExplored(node: Cell): boolean {
    return this.explored?.[node.y]?.[node.x] === true;
  }
}
