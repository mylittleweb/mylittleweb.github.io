import {Cell, CellState, Map} from "../../map/map";
import {PathSearchAlgorithm, Result} from "./path-search";

// pretty much identical to Breadth First search, except instead of visiting elements last-in-first-out,
// do it first-in-first-out instead
export class DepthFirstSearch implements PathSearchAlgorithm {
  static readonly Name = "Depth First Search";

  private explored: boolean[][] = [];

  private readonly toExplore: Cell[] = [];

  private result: Result = {
    name: DepthFirstSearch.Name,
    solution: undefined,
    steps: [],
    expanded: 0,
    pending: 0
  };

  constructor(private map: Map) {}

  run(): Result {
    if (this.map.getDestinations().length !== 2) {
      throw new Error("expecting 2 destinations");
    }

    const [init, goal] = this.map.getDestinations();
    this.addToPending(init);
    while (this.moreToExplore()) {
      const node = this.nextToExplore();
      for (const neighbour of this.map.expand(node)) {
        if (this.isGoal(neighbour, goal)) {
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
    } as Result;
  }

  private moreToExplore(): boolean {
    return this.toExplore.length > 0;
  }

  private nextToExplore(): Cell {
    const node = this.toExplore.pop() as Cell;
    this.map.markPath(node, CellState.Exploring);
    this.result.steps.push(this.map.cloneGrid());
    return node;
  }

  private isGoal(node: Cell, goal: Cell): boolean {
    if (node.x === goal.x && node.y === goal.y) {
      this.map.markPath(node, CellState.Solution);
      this.result.steps.push(this.map.cloneGrid());
      return true;
    }
    return false;
  }

  private addToPending(node: Cell) {
    this.toExplore.push(node);
    this.result.expanded += 1;
    this.map.mark(node, CellState.Pending);
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
