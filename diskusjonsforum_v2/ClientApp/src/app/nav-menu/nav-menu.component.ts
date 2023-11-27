import { Component } from '@angular/core';
import { Router } from '@angular/router';  // Import Router
import { NavMenuService } from './nav-menu.service';
import { Thread } from '../threads/threads';
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
  // initialises router and service for controllers
  constructor(
    private navMenuService: NavMenuService,
    private threadService: ThreadService,
    private router: Router
  ) {}

  handleSearchInput() {
    const searchTerm = this.handlesearchinput.trim().toLowerCase();

    // checks if there is any input, if there is, a search results is displayed in a dropdown with results based on the input
    if (searchTerm.length >= 1) {
      //searches for threads related to the "searchTerm"
      this.navMenuService.searchThreads(searchTerm).subscribe({
        next: (data) => {
          this.searchResults = data;
          const searchResults = document.getElementById('searchResultsDropdown') as HTMLElement;
          searchResults.style.display = this.searchResults.length > 0 ? 'block' : 'none';
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });
    } else {
      // if there is no search result the dropdown won't be shown
      this.searchResults = [];
      const searchResults = document.getElementById('searchResultsDropdown') as HTMLElement;
      searchResults.style.display = 'none';
    }
  }
  navigateToThreadform(thread: Thread) {
    this.router.navigate(['/thread-view', thread.threadId]); // navigates to the thread view
  }
}
