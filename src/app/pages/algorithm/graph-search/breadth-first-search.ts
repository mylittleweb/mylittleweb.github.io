import { Algorithm } from '../algorithm.component';
import { Problem, NodeState, ProblemNode } from '../discrete-problem/problem';

export class BreadthFirstSearch implements Algorithm<Problem, NodeState[][]>{
  private _visited: boolean[][] = []
  private _toVisit: ProblemNode[] = []

  run(problem: Problem): NodeState[][][] {
    const observableStates: NodeState[][][] = [];

    let n = problem.getInitNode();
    if (problem.isGoal(n)) {
      observableStates.push(problem.getNodesStatus());
      return observableStates;
    }

    this.visitLater(n);
    this.markVisited(n);

    while (this.moreToVisit()) {
      let node = this.nextToVisit();
      for (let neighbour of problem.expand(node)) {
        if (problem.isGoal(neighbour)) {
          observableStates.push(problem.getNodesStatus())
          return observableStates;
        }
        if (!this.visited(neighbour)) {
          this.markVisited(neighbour);
          this.visitLater(neighbour)
        }
      }
      observableStates.push(problem.getNodesStatus())
    }

    observableStates.push(problem.getNodesStatus());
    return observableStates;
  }

  private moreToVisit(): boolean {
    return this._toVisit.length > 0;
  }

  private nextToVisit(): ProblemNode {
    return this._toVisit.shift() as ProblemNode;
  }

  private visitLater(node: ProblemNode) {
    this._toVisit.push(node);
  }

  private markVisited(node: ProblemNode) {
    if (!this._visited[node.y]) {
      this._visited[node.y] = []
    }
    this._visited[node.y][node.x] = true;
  }

  private visited(node: ProblemNode): boolean {
    return this._visited?.[node.y]?.[node.x] === true;
  }
}
