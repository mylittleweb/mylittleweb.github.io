import { MinPriorityQueue } from '@datastructures-js/priority-queue';
import { Subject } from 'rxjs';
import { Algorithm } from '../algorithm.component';
import { Problem, NodeState, ProblemNode } from '../two-dimension-discrete-problem/problem';

export class AStarSearch implements Algorithm<Problem, NodeState[][]>{
  private _visited: ProblemNode[][] = []
  private toVisit: MinPriorityQueue<ProblemNode> = new MinPriorityQueue(a => a.cost + a.estimatedCost)

  getName(): string {
    return "A* Search"
  }

  run(problem: Problem, ob: Subject<NodeState[][]>) {
    this.reset()

    let n = problem.getInitNode();

    this.toVisit.push(n);
    this.updateVisited(n);

    while (!this.toVisit.isEmpty()) {
      let node = this.toVisit.pop() as ProblemNode;
      if (problem.isGoal(node)) {
        ob.next(problem.getNodesStatus())
        return
      }
      for (let neighbour of problem.expand(node)) {
        neighbour.estimatedCost = this.estimateCost(problem, neighbour);
        if (!this.visited(neighbour) || this.getVisited(neighbour).cost > neighbour.cost) {
          this.updateVisited(neighbour);
          this.toVisit.push(neighbour);
        } else {
          const lastVisit = this.getVisited(neighbour);
          const lastCost = lastVisit.cost + lastVisit.estimatedCost;
          const currentCost = neighbour.cost + neighbour.estimatedCost;
          if (lastCost > currentCost) {
            this.updateVisited(neighbour);
            this.toVisit.push(neighbour);
          }
        }
      }
      ob.next(problem.getNodesStatus())
    }

    ob.next(problem.getNodesStatus());
  }

  private estimateCost(problem: Problem, node: ProblemNode): number {
    const goal = problem.getGoalNode();
    return Math.abs(node.y - goal.y) + Math.abs(node.x - goal.x)
  }

  private updateVisited(node: ProblemNode) {
    if (!this._visited[node.y]) {
      this._visited[node.y] = []
    }
    this._visited[node.y][node.x] = node;
  }

  private getVisited(node: ProblemNode): ProblemNode {
    return this._visited[node.y][node.x];
  }

  private visited(node: ProblemNode): boolean {
    return this._visited?.[node.y]?.[node.x] !== undefined;
  }

  private reset() {
    this._visited = []
    this.toVisit = new MinPriorityQueue(a => a.cost + a.estimatedCost)
  }
}
