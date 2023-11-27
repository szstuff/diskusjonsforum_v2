import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Thread } from '../threads/threads';
import { NavMenuService } from './nav-menu.service';
import { ThreadService } from "../threads/threads.service";

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['../../css/nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;
  searchResults: Thread[] = [];
  handlesearchinput: string = '';

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  constructor(
    private navMenuService: NavMenuService,
    private threadService: ThreadService,
    private router: Router
  ) {}

  handleSearchInput() {
    const searchTerm = this.handlesearchinput.trim().toLowerCase();

    if (searchTerm.length >= 1) {
      this.navMenuService.searchThreads(searchTerm).subscribe({
        next: (data) => {
          this.searchResults = data;
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });
    } else {
      this.searchResults = [];
    }
  }
  navigateToThreadform(thread: Thread) {
    this.router.navigate(['/thread-view', thread.threadId]);
  }
}
