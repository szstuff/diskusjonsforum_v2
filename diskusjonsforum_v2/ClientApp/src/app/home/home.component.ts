import { Component, OnInit } from '@angular/core';
import { ThreadService } from '../threads/threads.service';
import { Thread } from '../threads/threads';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../css/IndexStyle.css', '../../css/thread_table.css'],
})
export class HomeComponent implements OnInit {
  viewTitle: string = 'Table';
  threads: Thread[] = [];
  isDropdownOpen: boolean = false;
  private _listFilter: string = '';

  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    console.log('In setter:', value);
    this.filteredThreads = this.performFilter(value);
  }

  filteredThreads: Thread[] = this.threads;

  @ViewChild('dropdownFilterElement') dropdownFilterElement!: ElementRef;

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;

    console.log('Clicked element:', clickedElement);
    console.log('Dropdown filter element:', this.dropdownFilterElement.nativeElement);

    // Check if the clicked element is outside the dropdown filter
    if (!this.dropdownFilterElement.nativeElement.contains(clickedElement)) {
      // Close the dropdown filter
      this.isDropdownOpen = false;
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  constructor(
    private threadService: ThreadService,
    private _http: HttpClient,
    private _router: Router,
    private _elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.loadThreads();
  }

  navigateToThreadform() {
    this._router.navigate(['/threadForm']);
  }

  navigateToThreads() {
    this._router.navigate(['/threads']);
  }

  loadThreads() {
    this.threadService.getThreadsByRecent().subscribe(
      (threads: Thread[]) => {
        this.threads = threads;
        this.loadCommentsForThreads(); // Load comments for the threads
      },
      (error) => {
        console.error('Error fetching threads by recent', error);
      }
    );
  }
  // filters the threads by recently posted
  filterBy(option: string) {
    // Implement your filtering logic here
    if (option === 'recent') {
      this.loadThreadsByRecent();
    } else if (option === 'comments') {
      this.loadThreadsByComments();
    }
  }
  loadThreadsByRecent() {
    this.threadService.getThreadsByRecent().subscribe(
      (threads: Thread[]) => {
        this.threads = threads;
        this.loadCommentsForThreads(); // Load comments for the filtered threads
      },
      (error) => {
        console.error('Error fetching threads by recent', error);
      }
    );
  }
  // filters the threads by most comments
  loadThreadsByComments() {
    this.threadService.getThreadsByComments().subscribe(
      (threads: Thread[]) => {
        this.threads = threads;
        this.loadCommentsForThreads(); // Load comments for the filtered threads
      },
      (error) => {
        console.error('Error fetching threads by comments', error);
      }
    );
  }

  // LastEditedAt value is only displayed when time difference is over 1s (60*1000ms)
  significantTimeDifference(thread: Thread): boolean {
     const timeDiff = new Date(thread.threadLastEditedAt).getTime() - new Date(thread.threadCreatedAt).getTime();
    return timeDiff > (60*1000)

  }

  private loadCommentsForThreads() {
    // Iterate through threads and load comments for each thread
    this.threads.forEach((thread) => {
      this.threadService.getCommentsForThread(thread.threadId).subscribe(
        (comments) => {
          thread.threadComments = comments;
        },
        (error) => {
          console.error(`Error fetching comments for thread ${thread.threadId}`, error);
        }
      );
    });

    // Update filteredThreads after loading comments
    this.filteredThreads = this.performFilter(this.listFilter);
  }

  performFilter(filterBy: string): Thread[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.threads.filter((thread: Thread) =>
      thread.threadTitle.toLocaleLowerCase().includes(filterBy)
    );
  }
}
