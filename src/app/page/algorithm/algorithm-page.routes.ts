import {Routes} from "@angular/router";
import {AlgorithmComponent} from "./algorithm.component";
import {MinimumSpanningTreeComponent} from "./minimum-spanning-tree/minimum-spanning-tree.component";
import {PathSearchComponent} from "./path-search/path-search.component";
import {RandomSampleComponent} from "./random-sample/random-sample.component";
import {MazeComponent} from "./maze/maze.component";
import {AutoDiffComponent} from "./auto-diff/auto-diff.component";
import {KMeanClusterComponent} from "./k-mean-cluster/k-mean-cluster.component";
import {TravelingSalesmanComponent} from "./traveling-salesman/traveling-salesman.component";

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
}, {
  path: "algorithm/auto-diff",
  component: AutoDiffComponent
}, {
  path: "algorithm/k-mean-clustering",
  component: KMeanClusterComponent
}, {
  path: "algorithm/minimum-spanning-tree",
  component: MinimumSpanningTreeComponent
}, {
  path: "algorithm/traveling-salesman",
  component: TravelingSalesmanComponent
}];
