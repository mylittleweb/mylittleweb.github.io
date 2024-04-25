import { Problem, ProblemNode } from '../discrete-problem/problem';
import { AStarSearch } from './a-star-search';
import { BreadthFirstSearch } from './breadth-first-search';
import { DepthFirstSearch } from './depth-first-search';

export interface Result {
  name: string,
  solution: ProblemNode | undefined;
  steps: ProblemNode[][][]
}

export interface PathSearchAlgorithm {
  run(problem: Problem): Result;
}

const PathSearchAlgorithms: {[key: string]: () => PathSearchAlgorithm}= {}
PathSearchAlgorithms[AStarSearch.Name] = () => new AStarSearch();
PathSearchAlgorithms[BreadthFirstSearch.Name] = () => new BreadthFirstSearch();
PathSearchAlgorithms[DepthFirstSearch.Name] = () => new DepthFirstSearch()
export { PathSearchAlgorithms }
