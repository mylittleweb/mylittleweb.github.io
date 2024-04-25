import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInput } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { GalleryComponent } from '../../components/gallary/gallery.component';
import { AlgorithmComponent } from './algorithm.component';
import { GraphSearchComponent } from './graph-search/graph-search.component';
import {
  DiscreteProblemComponent
} from './discrete-problem/discrete-problem.component';


@NgModule({
  declarations: [
    AlgorithmComponent,
    DiscreteProblemComponent,
    GraphSearchComponent,
  ],
  imports: [
    CommonModule,
    MatGridListModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    MatButtonModule,

    GalleryComponent,
  ]
})
export class AlgorithmModule { }
