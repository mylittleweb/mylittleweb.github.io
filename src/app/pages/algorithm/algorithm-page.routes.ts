import { Routes } from '@angular/router';
import { AlgorithmComponent } from './algorithm.component';
import { PathSearchComponent } from './path-search/path-search.component';
import { RandomSampleComponent } from './random-sample/random-sample.component';

export const AlgorithmPageRoutes: Routes = [{
  path: 'algorithm',
  component: AlgorithmComponent,
}, {
  path: 'algorithm/path-search',
  component: PathSearchComponent,
}, {
  path: 'algorithm/random-sample',
  component: RandomSampleComponent,
}];
