import {Component} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ReactiveFormsModule} from '@angular/forms';
import {GalleryComponent, GalleryItem} from '../../components/gallary/gallery.component';

@Component({
  selector: 'app-ui',
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    GalleryComponent,
  ],
  templateUrl: './ui.component.html',
  styleUrl: './ui.component.scss'
})
export class UiComponent {
  items: GalleryItem[] = [{
    label: "a Widget Dashboard 1",
    rowSpan: 1,
    columnSpan: 1,
    route: "/ui/widget-dashboard"
  }, {
    label: "b Widget Dashboard 2",
    rowSpan: 1,
    columnSpan: 1,
  }, {
    label: "c Widget Dashboard 3",
    rowSpan: 1,
    columnSpan: 1,
  }, {
    label: "d Widget Dashboard 4",
    rowSpan: 1,
    columnSpan: 1,
  }, {
    label: "e Widget Dashboard 5",
    rowSpan: 1,
    columnSpan: 1,
  }, {
    label: "f Widget Dashboard 6",
    rowSpan: 1,
    columnSpan: 1,
  }, {
    label: "g Widget Dashboard 7",
    rowSpan: 1,
    columnSpan: 1,
  }]
}
