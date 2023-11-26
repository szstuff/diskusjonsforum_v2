import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['../../css/nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false; //sets the value to false tells us if the navmenu is expanded or not

  collapse() {
    this.isExpanded = false; // isExpanded is set to false if the method "collapse" is called
  }

  toggle() {
    this.isExpanded = !this.isExpanded; // the boolean is changed from  true to false if the method "toggle" is called and vice versa
  }
}

