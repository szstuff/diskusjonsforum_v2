import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Thread } from './threads';
import { ThreadService } from "./threads.service";
import { Router } from "@angular/router";
import { ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-thread-component',
  templateUrl: './threads.component.html',
  styleUrls: ['../../css/IndexStyle.css', '../../css/thread_table.css']
})

export class ThreadsComponent implements OnInit {
  viewTitle: string = 'Table';
  threads: Thread[] = [];
  private _listFilter: string = '';
  isDropdownOpen: boolean = false;


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
    private _threadService: ThreadService,
    public _http: HttpClient,
    private _router: Router
  ) { }

  // function for retrieving  threads
  getThreads(): void {
    this._threadService.getThreadsByRecent() // Use a method that retrieves threads sorted by date
      .subscribe(data => {
        console.log('All', JSON.stringify(data));
        this.threads = data;
        this.loadCommentsForThreads(); // Load comments for the threads
      },
        (error) => {
          console.error('Error getting threads', error);
          console.error('An error occurred while fetching threads. Please try again later.');
        });
  }

  // function for loading comments belonging to a thread by threadId
  private loadCommentsForThreads() {
    this.threads.forEach((thread) => {
      this._threadService.getCommentsForThread(thread.threadId).subscribe(
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

  // navigates to the thread from when creating a new thread
  navigateToThreadform() {
    this._router.navigate(['/threadForm']);
  }

  // changes grid view for how the threads in the index
  navigateToHome() {
    this._router.navigate(['/home']);
  }

  ngOnInit(): void {
    console.log('ThreadsComponent created');
    this.getThreads();
  }

  // updates the thread
  update(thread: Thread): void {
    this._threadService.updateThread(thread).subscribe(
      () => {
        console.log('Thread updated');
        this.getThreads();
      },
      (error) => {
        console.error('Error updating thread', error);
      }
    );
  }

  // deletes the thread by threadId
  delete(threadId: number): void {
    this._threadService.deleteThread(threadId).subscribe(
      () => {
        console.log('Thread deleted');
        this.getThreads();
      },
      (error) => {
        console.error('Error deleting thread', error);
      }
    );
  }

  // LastEditedAt value is only displayed when time difference is over 1s (60*1000ms)
  significantTimeDifference(thread: Thread): boolean {
    const timeDiff = new Date(thread.threadLastEditedAt).getTime() - new Date(thread.threadCreatedAt).getTime();
    return timeDiff > (60*1000)

  }

  filterBy(option: string) {
    // Implement your filtering logic here
    if (option === 'recent') {
      this.loadThreadsByRecent();
    } else if (option === 'comments') {
      this.loadThreadsByComments();
    }
  }

  loadThreadsByRecent() {
    this._threadService.getThreadsByRecent().subscribe(
      (threads: Thread[]) => {
        this.threads = threads;
        this.loadCommentsForThreads(); // Load comments for the filtered threads
      },
      (error) => {
        console.error('Error fetching threads by recent', error);
      }
    );
  }

  loadThreadsByComments() {
    this._threadService.getThreadsByComments().subscribe(
      (threads: Thread[]) => {
        this.threads = threads;
        this.loadCommentsForThreads(); // Load comments for the filtered threads
      },
      (error) => {
        console.error('Error fetching threads by comments', error);
      }
    );
  }
}
