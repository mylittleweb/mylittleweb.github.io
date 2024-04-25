import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatInput} from "@angular/material/input";
import {MatToolbarModule} from "@angular/material/toolbar";
import {GalleryComponent} from "../../component/gallary/gallery.component";
import {GraphComponent} from "../../component/graph/graph/graph.component";
import {AlgorithmComponent} from "./algorithm.component";
import {MinimumSpanningTreeComponent} from "./minimum-spanning-tree/minimum-spanning-tree.component";
import {PathSearchComponent} from "./path-search/path-search.component";
import {
  MapComponent
} from "./map/map.component";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatSelectModule} from "@angular/material/select";

import {RandomSampleComponent} from "./random-sample/random-sample.component";
import {UniformSampleConfigComponent} from "./random-sample/uniform-sample-config/uniform-sample-config.component";
import {
  BernoulliSampleConfigComponent
} from "./random-sample/bernoulli-sample-config/bernoulli-sample-config.component";
import {NormalSampleConfigComponent} from "./random-sample/normal-sample-config/normal-sample-config.component";
import {ExponentialSampleConfigComponent} from "./random-sample/exponential-sample-config/exponential-sample-config.component";
import {PoissonSampleConfigComponent} from "./random-sample/poisson-sample-config/poisson-sample-config.component";
import {MazeComponent} from "./maze/maze.component";
import {FormFieldSelectComponent} from "../../component/form/form-field-select/form-field-select.component";
import {FormFieldComponent} from "../../component/form/form-field/form-field.component";
import {KMeanClusterComponent} from "./k-mean-cluster/k-mean-cluster.component";
import {TravelingSalesmanComponent} from "./traveling-salesman/traveling-salesman.component";
import {LineChartComponent} from "../../component/graph/line-chart/line-chart.component";
import {SimulatedAnnealingComponent} from "./traveling-salesman/simulated-annealing/simulated-annealing.component";
import {GeneticAlgorithmComponent} from "./traveling-salesman/genetic-algorithm/genetic-algorithm.component";
import {
  AntColonyOptimizationComponent
} from "./traveling-salesman/ant-colony-optimization/ant-colony-optimization.component";

@NgModule({
  declarations: [
    AlgorithmComponent,
    MapComponent,
    PathSearchComponent,
    MazeComponent,

    RandomSampleComponent,
    UniformSampleConfigComponent,
    BernoulliSampleConfigComponent,
    NormalSampleConfigComponent,
    ExponentialSampleConfigComponent,
    PoissonSampleConfigComponent,

    KMeanClusterComponent,
    MinimumSpanningTreeComponent,

    TravelingSalesmanComponent,
    SimulatedAnnealingComponent,
    GeneticAlgorithmComponent,
    AntColonyOptimizationComponent
  ],
  imports: [
    CommonModule,
    MatGridListModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    MatButtonModule,

    GalleryComponent,
    FormFieldSelectComponent,
    FormFieldComponent,

    GraphComponent,
    LineChartComponent
  ]
})
export class AlgorithmModule { }
