import {Component, ElementRef, OnDestroy, OnInit, signal, viewChild} from "@angular/core";
import {WidgetComponent} from "./widget/widget.component";
import {DashboardService} from "./dashboard.service";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {wrapGrid} from "animate-css-grid";
import {CdkDragDrop, CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";
import {MatToolbar} from "@angular/material/toolbar";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {fromEvent, Subscription, tap, throttleTime} from "rxjs";

@Component({
  selector: "app-widget-dashboard",
  imports: [
    WidgetComponent,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    CdkDropList,
    CdkDropListGroup,
    MatToolbar,
    MatGridList,
    MatGridTile
  ],
  providers: [DashboardService],
  templateUrl: "./widget-dashboard.component.html",
  styleUrl: "./widget-dashboard.component.scss"
})
export class WidgetDashboardComponent implements OnInit, OnDestroy {
  dashboard = viewChild.required<ElementRef>("widgetDashboard");

  gridCols = signal<number>(4);

  private subscription: Subscription = new Subscription();

  constructor(public store: DashboardService) {}

  ngOnInit() {
    this.subscription.add(this._observeWindowResize());

    wrapGrid(this.dashboard().nativeElement, {duration: 250});
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // eslint-disable-next-line
    drop (event: CdkDragDrop<number, any>) {
    const {previousContainer, container} = event;
    this.store.swapWidgetPosition(previousContainer.data, container.data);
  }

  _observeWindowResize() {
    return fromEvent(window, "resize").pipe(
      throttleTime(200),
      tap(() => {
        const containerWidth = this.dashboard().nativeElement.clientWidth;
        this.gridCols.set(Math.floor(containerWidth / 300));
      })
    ).subscribe();
  }
}
