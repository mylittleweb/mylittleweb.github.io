import { Routes } from '@angular/router';
import { AlgorithmComponent } from './algorithm.component';
import { AStarSearch } from './graph-search/a-star-search';
import { BreadthFirstSearch } from './graph-search/breadth-first-search';
import { GraphSearchComponent } from './graph-search/graph-search.component';

export const AlgorithmPageRoutes: Routes = [{
  path: 'algorithm',
  component: AlgorithmComponent,
}, {
  path: 'algorithm/breadth-first-search',
  component: GraphSearchComponent,
  data: {
    algorithm: new BreadthFirstSearch()
  }
}, {
  path: 'algorithm/a-star-search',
  component: GraphSearchComponent,
  data: {
    algorithm: new AStarSearch()
  }
}];
