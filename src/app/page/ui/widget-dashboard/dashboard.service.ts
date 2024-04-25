import {computed, effect, Injectable, signal} from "@angular/core";
import {Widget} from "./widget/widget.component";
import {ViewsComponent} from "./widgets/views/views.component";

@Injectable()
export class DashboardService {

  widgets = signal<Widget[]>([{
    id: 1,
    label: "View 1",
    rowSpan: 1,
    columnSpan: 1,
    content: ViewsComponent
  }, {
    id: 2,
    label: "Views 2",
    rowSpan: 1,
    columnSpan: 1,
    content: ViewsComponent
  }, {
    id: 3,
    label: "Big Views 3",
    rowSpan: 2,
    columnSpan: 1,
    content: ViewsComponent
  }, {
    id: 4,
    label: "Views 4",
    rowSpan: 1,
    columnSpan: 1,
    content: ViewsComponent
  }, {
    id: 5,
    label: "Views 5",
    rowSpan: 1,
    columnSpan: 1,
    content: ViewsComponent
  }, {
    id: 6,
    label: "Views 6",
    rowSpan: 1,
    columnSpan: 1,
    content: ViewsComponent
  }]);


  addedWidgets = signal<Widget[]>([]);

  widgetsToAdd = computed(() => {
    const added = this.addedWidgets().map(widget => widget.id);
    return this.widgets().filter(widget => !added.includes(widget.id));
  });

  saveWidgets = effect(() => {
    const widgets: Partial<Widget>[] = this.addedWidgets().map(widget => ({...widget}));
    widgets.forEach(widget => {
      delete widget.content;
    });

    localStorage.setItem("dashboard-widgets", JSON.stringify(widgets));
  });

  constructor() {
    this.fetchWidgets();
  }

  fetchWidgets() {
    const widgetesRaw = localStorage.getItem("dashboard-widgets");
    if (!widgetesRaw) {
      return;
    }

    const widgets = JSON.parse(widgetesRaw) as Widget[];
    widgets.forEach(widget => {
      const content = this.widgets().find(widget => widget.id === widget.id)?.content;
      if (content) {
        widget.content = content;
      }
    });

    this.addedWidgets.set(widgets);
  }

  addWidget(widget: Widget): void {
    this.addedWidgets.set([...this.addedWidgets(), {...widget}]);
  }

  updateWidget(id: number, widget: Partial<Widget>) {
    const idx = this.addedWidgets().findIndex(w => w.id === id);
    if (idx === -1) {
      return;
    }

    const newWidgets = [...this.addedWidgets()];
    newWidgets[idx] = {...newWidgets[idx],
      ...widget};
    this.addedWidgets.set(newWidgets);
  }

  removeWidget(id: number) {
    this.addedWidgets.set(this.addedWidgets().filter(widget => widget.id !== id));
  }

  swapWidgetPosition(sourceId: number, targetId: number) {
    const sourceIdx = this.addedWidgets().findIndex(widget => widget.id === sourceId);
    if (sourceIdx === -1) {
      return;
    }
    const targetIdx = this.addedWidgets().findIndex(widget => widget.id === targetId);
    if (targetIdx === -1) {
      return;
    }

    const newWidgets = [...this.addedWidgets()];
    [newWidgets[sourceIdx], newWidgets[targetIdx]] = [newWidgets[targetIdx], newWidgets[sourceIdx]];
    this.addedWidgets.set(newWidgets);
  }
}
