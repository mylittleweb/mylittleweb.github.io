import {Routes} from "@angular/router";
import {FormExampleComponent} from "./form-example/form-example.component";
import {UiComponent} from "./ui.component";
import {WidgetDashboardComponent} from "./widget-dashboard/widget-dashboard.component";

export const UiPageRoutes: Routes = [{
  path: "ui",
  component: UiComponent
}, {
  path: "ui/widget-dashboard",
  component: WidgetDashboardComponent
}, {
  path: "ui/form-example",
  component: FormExampleComponent
}];
