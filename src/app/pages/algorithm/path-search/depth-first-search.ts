import {Problem, ProblemNode} from '../discrete-problem/problem';
import { Result, PathSearchAlgorithm } from './path-search';

// pretty much identical to Breadth First search, except instead of visiting elements last-in-first-out,
// do it first-in-first-out instead
export class DepthFirstSearch implements PathSearchAlgorithm {
  static readonly Name = "Depth First Search"

  private explored: boolean[][] = []
  private readonly toExplore: ProblemNode[] = []

  run(problem: Problem): Result {
    const observableStates: ProblemNode[][][] = [];

    let n = problem.getInitNode();
    if (problem.isGoal(n)) {
      observableStates.push(problem.getNodes());
      return {
        name: DepthFirstSearch.Name,
        solution: n,
        steps: observableStates
      };
    }

    this.addToPending(n);
    while (this.moreToExplore()) {
      let node = this.nextToExplore();
      for (let neighbour of problem.expand(node)) {
        if (problem.isGoal(neighbour)) {
          observableStates.push(problem.getNodes())
          return {
            name: DepthFirstSearch.Name,
            solution: neighbour,
            steps: observableStates
          };
        }
        if (!this.getExplored(neighbour)) {
          this.addToPending(neighbour)
        }
      }
      observableStates.push(problem.getNodes())
    }

    observableStates.push(problem.getNodes());
    return {
      name: DepthFirstSearch.Name,
      solution: undefined,
      steps: observableStates
    };
  }

  private moreToExplore(): boolean {
    return this.toExplore.length > 0;
  }

  private nextToExplore(): ProblemNode {
    return this.toExplore.pop() as ProblemNode;
  }

  private addToPending(node: ProblemNode) {
    this.toExplore.push(node);
    this.addToExplored(node);
  }

  private addToExplored(node: ProblemNode) {
    if (!this.explored[node.y]) {
      this.explored[node.y] = []
    }
    this.explored[node.y][node.x] = true;
  }

  private getExplored(node: ProblemNode): boolean {
    return this.explored?.[node.y]?.[node.x] === true;
  }
}
