import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Thread } from '../threads/threads';
import { NavMenuService } from './nav-menu.service';
import {Location} from '@angular/common';


@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['../../css/nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;
  searchResults: Thread[] = [];
  handlesearchinput: string = '';

  // Add a reference to the search bar element
  @ViewChild('searchBarElement') searchBarElement!: ElementRef;

  // Event handler for document click
  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;

    // Check if the clicked element is outside the search bar
    if (!this.searchBarElement.nativeElement.contains(clickedElement)) {
      // Reset the search input when clicking outside the search bar
      this.handlesearchinput = '';

      // Close the search results dropdown
      this.searchResults = [];
    }
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
  // initialises router and service for controllers
  constructor(
    private navMenuService: NavMenuService,
    private router: Router,
    private _location: Location
  ) { }

  // a function that handles the input in the search bar
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

  goBack() {
    this._location.back();
  }

  navigateToThreadform(thread: Thread) {
    this.router.navigate(['/thread-view', thread.threadId]); // navigates to the thread view
  }
}
