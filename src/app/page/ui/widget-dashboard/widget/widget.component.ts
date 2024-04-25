import {Component, input, Type} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {CdkDrag, CdkDragPlaceholder} from "@angular/cdk/drag-drop";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatCardModule} from "@angular/material/card";
import {DashboardService} from "../dashboard.service";

export interface Widget {
  id: number;
  label: string;
  content: Type<unknown>;
  rowSpan: number;
  columnSpan: number;
}

@Component({
  selector: "app-widget",
  imports: [CommonModule, MatIconButton, MatIcon, CdkDrag, CdkDragPlaceholder, MatToolbarModule, MatCardModule],
  templateUrl: "./widget.component.html",
  styleUrl: "./widget.component.scss"
})
export class WidgetComponent {
  data = input.required<Widget>();

  constructor(public store: DashboardService) {
  }
}
