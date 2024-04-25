import {Map, Cell, Grid} from "../../map/map";
import {AStarSearch} from "./a-star-search";
import {BreadthFirstSearch} from "./breadth-first-search";
import {DepthFirstSearch} from "./depth-first-search";

export interface Result {
  name: string;
  solution: Cell | undefined;
  steps: Grid[];
  expanded: number;
  pending: number;
}

export interface PathSearchAlgorithm {
  run(): Result;
}

export type PathSearchAlgorithmBuilder = (map: Map) => PathSearchAlgorithm;
export type PathSearchAlgorithmMap = {
  [key: string]: PathSearchAlgorithmBuilder;
};

const PathSearchAlgorithms: PathSearchAlgorithmMap = {};
PathSearchAlgorithms[AStarSearch.Name] = (map: Map) => new AStarSearch(map);
PathSearchAlgorithms[BreadthFirstSearch.Name] = (map: Map) => new BreadthFirstSearch(map);
PathSearchAlgorithms[DepthFirstSearch.Name] = (map: Map) => new DepthFirstSearch(map);
export {PathSearchAlgorithms};
