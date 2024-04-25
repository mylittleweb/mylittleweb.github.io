import {Component} from "@angular/core";
import {MatIconModule} from "@angular/material/icon";
import {MenuItem, SidenavComponent} from "./component/sidenav/sidenav.component";
import {AlgorithmModule} from "./page/algorithm/algorithm.module";

@Component({
  selector: "app-root",
  imports: [
    MatIconModule, SidenavComponent,
    AlgorithmModule
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss"
})
export class AppComponent {
  title = "My Little Web";

  menuItems: MenuItem[] = [{
    icon: "home",
    label: "Home",
    route: "home"
  }, {
    icon: "code",
    label: "Algorithm",
    route: "algorithm"
  }, {
    icon: "dashboard",
    label: "UI Component",
    route: "ui"
  }];
}
