import { Component } from '@angular/core';
import { GalleryItem } from '../../components/gallary/gallery.component';

@Component({
  selector: 'app-algorithm',
  templateUrl: './algorithm.component.html',
  styleUrl: './algorithm.component.scss',
  standalone: false
})
export class AlgorithmComponent {
  items: GalleryItem[] = [{
    label: "Path Search",
    rowSpan: 1, columnSpan: 1,
    route: "/algorithm/path-search"
  }, {
    label: "Random Sample",
    rowSpan: 1, columnSpan: 1,
    route: "/algorithm/random-sample"
  }]
}
