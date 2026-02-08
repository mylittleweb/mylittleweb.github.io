import {Component, computed, input, signal} from "@angular/core";

import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {RouterModule} from "@angular/router";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconButton} from "@angular/material/button";
import {MatToolbar} from "@angular/material/toolbar";

export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
  subItems?: MenuItem[];
};

@Component({
  selector: "app-sidenav",
  imports: [MatListModule, MatIconModule, RouterModule, MatSidenavModule, MatIconButton, MatToolbar],
  templateUrl: "./sidenav.component.html",
  styleUrl: "./sidenav.component.scss"
})
export class SidenavComponent {

  collapsed = signal<boolean>(false);

  sidNavWidth = computed(() => {
    return this.collapsed() ? "65px" : "250px";
  });

  menuItems = input.required<MenuItem[]>();
}
