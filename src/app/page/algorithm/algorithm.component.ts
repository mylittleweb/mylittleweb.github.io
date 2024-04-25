import {Component} from "@angular/core";
import {GalleryItem} from "../../component/gallary/gallery.component";

@Component({
  selector: "app-algorithm",
  templateUrl: "./algorithm.component.html",
  styleUrl: "./algorithm.component.scss",
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
  }, {
    label: "Maze Generation",
    rowSpan: 1, columnSpan: 1,
    route: "/algorithm/maze-generation"
  }, {
    label: "Auto Diff",
    rowSpan: 1, columnSpan: 1,
    route: "/algorithm/auto-diff"
  }, {
    label: "K-means Clustering",
    rowSpan: 1, columnSpan: 1,
    route: "/algorithm/k-mean-clustering"
  }, {
    label: "Minimum Spanning Tree",
    rowSpan: 1, columnSpan: 1,
    route: "/algorithm/minimum-spanning-tree"
  }, {
    label: "Traveling Salesman",
    rowSpan: 1, columnSpan: 1,
    route: "/algorithm/traveling-salesman"
  }];
}
