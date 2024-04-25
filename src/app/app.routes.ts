import {Routes} from "@angular/router";
import {HomeComponent} from "./page/home/home.component";
import {UiPageRoutes} from "./page/ui/ui-page.routes";
import {AlgorithmPageRoutes} from "./page/algorithm/algorithm-page.routes";

export const routes: Routes = [{
  path: "",
  pathMatch: "full",
  component: HomeComponent
}, {
  path: "home",
  component: HomeComponent
},
...AlgorithmPageRoutes,
...UiPageRoutes
];
