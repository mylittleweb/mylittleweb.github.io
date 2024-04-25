import {PathSearchAlgorithm, Result} from './path-search';
import { Problem, ProblemNode } from '../discrete-problem/problem';

export class BreadthFirstSearch implements PathSearchAlgorithm {
  static readonly Name = "Breadth First Search"

  private explored: boolean[][] = []
  private readonly toExplore: ProblemNode[] = []

  run(problem: Problem): Result {
    const observableStates: ProblemNode[][][] = [];

    let n = problem.getInitNode();
    if (problem.isGoal(n)) {
      observableStates.push(problem.getNodes());
      return {
        name: BreadthFirstSearch.Name,
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
            name: BreadthFirstSearch.Name,
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
      name: BreadthFirstSearch.Name,
      solution: undefined,
      steps: observableStates
    };
  }

  private moreToExplore(): boolean {
    return this.toExplore.length > 0;
  }

  private nextToExplore(): ProblemNode {
    return this.toExplore.shift() as ProblemNode;
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
