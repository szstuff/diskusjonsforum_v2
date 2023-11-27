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

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  searchResults: any[] = [];

  constructor(
      private navMenuService: NavMenuService,
      private threadService: ThreadService,
      private router: Router  // Inject Router
  ) {}

  ngOnInit(): void {
    const searchBar = document.getElementById('searchBar');
    const searchResultsDropdown = document.getElementById('searchResultsDropdown');

    if (searchBar) {
      searchBar.addEventListener('input', () => {
        this.handleSearchInput();
      });
    }
  }
  handleSearchInput() {
    const searchBar = document.getElementById('searchBar') as HTMLInputElement;

    const searchTerm = searchBar.value.trim().toLowerCase();

    if (searchTerm.length >= 1) {
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
      this.searchResults = [];
      const searchResults = document.getElementById('searchResultsDropdown') as HTMLElement;
      searchResults.style.display = 'none';
    }
  }
  navigateToThreadform(thread: Thread) {
    this.router.navigate(['/thread-view', thread.threadId]);
  }
}
