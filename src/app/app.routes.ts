import { Routes } from '@angular/router';
import {SettingComponent} from './pages/setting/setting.component';
import {HomeComponent} from './pages/home/home.component';
import {UiPageRoutes} from './pages/ui/ui-page.routes';
import { AlgorithmPageRoutes } from './pages/algorithm/algorithm-page.routes';

export const routes: Routes = [{
  path: '',
  pathMatch: "full",
  redirectTo: 'home',
}, {
  path: 'home',
  component: HomeComponent,
}, {
  path: 'setting',
  component: SettingComponent,
},
  ...AlgorithmPageRoutes,
  ...UiPageRoutes,
];
