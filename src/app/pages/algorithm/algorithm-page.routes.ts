import {Routes} from "@angular/router";
import {AlgorithmComponent} from "./algorithm.component";
import {PathSearchComponent} from "./path-search/path-search.component";
import {RandomSampleComponent} from "./random-sample/random-sample.component";
import {MazeComponent} from "./maze/maze.component";

export const AlgorithmPageRoutes: Routes = [{
  path: "algorithm",
  component: AlgorithmComponent
}, {
  path: "algorithm/path-search",
  component: PathSearchComponent
}, {
  path: "algorithm/random-sample",
  component: RandomSampleComponent
}, {
  path: "algorithm/maze-generation",
  component: MazeComponent
}];
