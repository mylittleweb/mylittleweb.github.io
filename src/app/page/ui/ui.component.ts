import {Component} from "@angular/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {GalleryComponent, GalleryItem} from "../../component/gallary/gallery.component";

@Component({
  selector: "app-ui",
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    GalleryComponent
  ],
  templateUrl: "./ui.component.html",
  styleUrl: "./ui.component.scss"
})
export class UiComponent {
  items: GalleryItem[] = [{
    label: "Widget Dashboard",
    rowSpan: 1,
    columnSpan: 1,
    route: "/ui/widget-dashboard"
  }, {
    label: "Form",
    rowSpan: 1,
    columnSpan: 1,
    route: "/ui/form-example"
  }];
}
