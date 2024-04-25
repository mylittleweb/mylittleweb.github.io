import {Component, ElementRef, input, OnDestroy, OnInit, signal, viewChild} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatGridListModule} from "@angular/material/grid-list";
import {debounceTime, fromEvent, Subscription, tap, throttleTime} from "rxjs";
import {MatToolbar} from "@angular/material/toolbar";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {RouterLink} from "@angular/router";
import {FormFields} from "../form/form-field";
import {FormFieldTextComponent} from "../form/form-field-text/form-field-text.component";

export interface GalleryItem {
  label: string;
  rowSpan: number;
  columnSpan: number;
  route?: string;
}

@Component({
  selector: "app-gallery",
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatGridListModule,
    MatToolbar,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    FormFieldTextComponent
  ],
  templateUrl: "./gallery.component.html",
  styleUrl: "./gallery.component.scss"
})
export class GalleryComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();

  container = viewChild.required<ElementRef>("galleryContainer");

  items = input.required<GalleryItem[]>();
  gridCols = signal<number>(4);
  itemWidth = input.required<number>();

  filter = new FormControl();
  filteredItems = signal<GalleryItem[]>([]);
  field = FormFields.text("filter", "Filter", this.filter);

  ngOnInit(): void {
    this.filteredItems.set(this.items());

    this.subscription.add(this._observeWindowResize());
    this.subscription.add(this._observeFilterChange());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  _observeWindowResize() {
    return fromEvent(window, "resize").pipe(
      throttleTime(200),
      tap(() => {
        const containerWidth = this.container().nativeElement.clientWidth;
        this.gridCols.set(Math.floor(containerWidth / this.itemWidth()));
      })
    ).subscribe();
  }

  _observeFilterChange() {
    return this.filter.valueChanges.pipe(
      debounceTime(200),
      tap((v: string) => {
        v = v.toLowerCase();
        const filtered = this.items().filter(item => {
          return item.label.toLowerCase().includes(v);
        });
        this.filteredItems.set(filtered);
      })
    ).subscribe();
  }
}
