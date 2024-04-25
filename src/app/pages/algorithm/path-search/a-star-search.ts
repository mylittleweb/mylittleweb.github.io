import { MinPriorityQueue } from '@datastructures-js/priority-queue';
import {PathSearchAlgorithm, Result} from './path-search';
import { Problem, ProblemNode } from '../discrete-problem/problem';

export class AStarSearch implements PathSearchAlgorithm {
  static readonly Name = "A* Search"

  private explored: ProblemNode[][] = []
  private readonly toExplore: MinPriorityQueue<ProblemNode> = new MinPriorityQueue(a => a.cost + a.estimatedCost)

  run(problem: Problem): Result {
    const observableStates: ProblemNode[][][] = [];

    let n = problem.getInitNode();

    this.addToPending(n);
    while (!this.toExplore.isEmpty()) {
      let node = this.toExplore.pop() as ProblemNode;
      if (problem.isGoal(node)) {
        observableStates.push(problem.getNodes());
        return {
          name: AStarSearch.Name,
          solution: node,
          steps: observableStates
        };
      }
      for (let neighbour of problem.expand(node)) {
        let {x, y} = neighbour;
        neighbour.estimatedCost = this.estimateCost(problem, neighbour);
        if (this.getExplored(x, y) == undefined || (<ProblemNode>this.getExplored(x, y)).cost > neighbour.cost) {
          this.addToPending(neighbour);
        } else {
          const lastVisit = this.getExplored(x, y) as ProblemNode;
          const lastEstimatedTotalCost = lastVisit.cost + lastVisit.estimatedCost;
          const currentEstimatedTotalCost = neighbour.cost + neighbour.estimatedCost;
          if (lastEstimatedTotalCost > currentEstimatedTotalCost) {
            this.addToPending(neighbour);
          }
        }
      }
      observableStates.push(problem.getNodes())
    }

    observableStates.push(problem.getNodes());
    return {
      name: AStarSearch.Name,
      solution: undefined,
      steps: observableStates
    };
  }

  private estimateCost(problem: Problem, node: ProblemNode): number {
    const goal = problem.getGoalNode();
    return Math.abs(node.y - goal.y) + Math.abs(node.x - goal.x)
  }

  private addToPending(n: ProblemNode) {
    this.toExplore.push(n);
    this.addToExplored(n);
  }

  private addToExplored(node: ProblemNode) {
    if (!this.explored[node.y]) {
      this.explored[node.y] = []
    }
    this.explored[node.y][node.x] = node;
  }

  private getExplored(x: number, y: number): ProblemNode | undefined {
    return this.explored?.[y]?.[x];
  }
}
