import { Component } from '@angular/core';
import { GalleryItem } from '../../components/gallary/gallery.component';
import {
  DiscreteProblemService
} from './discrete-problem/discrete-problem.service';

export interface Algorithm<Problem, ObservableState> {
  run(problem: Problem): ObservableState[];
}

export interface AlgorithmBuilder<Problem, ObservableState> {
  name: string,
  getInstance(): Algorithm<Problem, ObservableState>
}

@Component({
  selector: 'app-algorithm',
  providers: [
    DiscreteProblemService
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
