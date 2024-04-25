import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { GalleryItem } from '../../components/gallary/gallery.component';
import {
  TwoDimensionDiscreteProblemService
} from './two-dimension-discrete-problem/two-dimension-discrete-problem.service';

export interface Algorithm<Problem, ObservableState> {
  getName(): string;
  run(problem: Problem, observer: Subject<ObservableState>): void;
}

@Component({
  selector: 'app-algorithm',
  providers: [
    TwoDimensionDiscreteProblemService
  ],
  templateUrl: './algorithm.component.html',
  styleUrl: './algorithm.component.scss',
  standalone: false
})
export class AlgorithmComponent {
  items: GalleryItem[] = [{
    label: "Breadth First Search",
    rowSpan: 1, columnSpan: 1,
    route: "/algorithm/breadth-first-search"
  }, {
    label: "A* Search",
    rowSpan: 1, columnSpan: 1,
    route: "/algorithm/a-star-search"
  }]
}
