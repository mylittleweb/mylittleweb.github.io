import { MinPriorityQueue } from '@datastructures-js/priority-queue';
import { Algorithm } from '../algorithm.component';
import { Problem, NodeState, ProblemNode } from '../discrete-problem/problem';

export class AStarSearch implements Algorithm<Problem, NodeState[][]>{
  private _visited: ProblemNode[][] = []
  private toVisit: MinPriorityQueue<ProblemNode> = new MinPriorityQueue(a => a.cost + a.estimatedCost)

  run(problem: Problem): NodeState[][][] {
    const observableStates: NodeState[][][] = [];

    let n = problem.getInitNode();

    this.toVisit.push(n);
    this.updateVisited(n);

    while (!this.toVisit.isEmpty()) {
      let node = this.toVisit.pop() as ProblemNode;
      if (problem.isGoal(node)) {
        observableStates.push(problem.getNodesStatus());
        return observableStates;
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
      observableStates.push(problem.getNodesStatus())
    }

    observableStates.push(problem.getNodesStatus());
    return observableStates;
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
}
