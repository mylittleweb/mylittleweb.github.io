import { Subject } from 'rxjs';
import { Algorithm } from '../algorithm.component';
import { Problem, NodeState, ProblemNode } from '../two-dimension-discrete-problem/problem';

export class BreadthFirstSearch implements Algorithm<Problem, NodeState[][]>{
  private _visited: boolean[][] = []
  private _toVisit: ProblemNode[] = []

  getName(): string {
    return "Breadth First Search"
  }

  run(problem: Problem, ob: Subject<NodeState[][]>) {
    this.reset()

    let n = problem.getInitNode();
    if (problem.isGoal(n)) {
      ob.next(problem.getNodesStatus());
      return;
    }

    this.visitLater(n);
    this.markVisited(n);

    while (this.moreToVisit()) {
      let node = this.nextToVisit();
      for (let neighbour of problem.expand(node)) {
        if (problem.isGoal(neighbour)) {
          ob.next(problem.getNodesStatus())
          return;
        }
        if (!this.visited(neighbour)) {
          this.markVisited(neighbour);
          this.visitLater(neighbour)
        }
      }
      ob.next(problem.getNodesStatus())
    }

    ob.next(problem.getNodesStatus());
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
    return this._visited?.[node.y]?.[node.x];
  }

  private reset() {
    this._visited = []
    this._toVisit = []
  }
}
