import {Routes} from '@angular/router';
import {UiComponent} from './ui.component';
import {WidgetDashboardComponent} from './widget-dashboard/widget-dashboard.component';

export const UiPageRoutes: Routes = [{
  path: 'ui',
  component: UiComponent,
}, {
  path: 'ui/widget-dashboard',
  component: WidgetDashboardComponent,
}];
