import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Thread } from './threads';
import { ThreadService } from "./threads.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-thread-component',
  templateUrl: './threads.component.html',
  styleUrls: ['../../css/IndexStyle.css', '../../css/thread_table.css']
})

export class ThreadsComponent implements OnInit {
  viewTitle: string = 'Table';
  threads: Thread[] = [];
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

  constructor(
    private _threadService: ThreadService,
    public _http: HttpClient,
    private _router: Router
  ) { }

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

  private loadCommentsForThreads() {
    // Iterate through threads and load comments for each thread
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

  navigateToThreadform() {
    this._router.navigate(['/threadForm']);
  }

  navigateToHome() {
    this._router.navigate(['/home']);
  }

  ngOnInit(): void {
    console.log('ThreadsComponent created');
    this.getThreads();
  }

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
}
