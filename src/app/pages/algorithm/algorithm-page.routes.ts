import { Routes } from '@angular/router';
import { AlgorithmComponent } from './algorithm.component';
import { BreadthFirstSearch } from './graph-search/breadth-first-search';
import { GraphSearchComponent } from './graph-search/graph-search.component';
import {AStarSearch} from './graph-search/a-star-search';

export const AlgorithmPageRoutes: Routes = [{
  path: 'algorithm',
  component: AlgorithmComponent,
}, {
  path: 'algorithm/breadth-first-search',
  component: GraphSearchComponent,
  data: {
    algorithm: {
      name: "Breadth First Search",
      getInstance: () => new BreadthFirstSearch()
    }
  }
}, {
  path: 'algorithm/a-star-search',
  component: GraphSearchComponent,
  data: {
    algorithm: {
      name: "A* Search",
      getInstance: () => new AStarSearch()
    }
  }
}];
