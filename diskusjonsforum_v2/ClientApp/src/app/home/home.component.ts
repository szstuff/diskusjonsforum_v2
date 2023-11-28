import { Component, OnInit } from '@angular/core';
import { ThreadService } from '../threads/threads.service';
import { Thread } from '../threads/threads';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../css/IndexStyle.css', '../../css/thread_table.css'],
})
export class HomeComponent implements OnInit {
  threads: Thread[] = [];
  isDropdownOpen: boolean = false;

  constructor(
    private threadService: ThreadService,
    private _http: HttpClient,
    private _router: Router,
    private route: ActivatedRoute
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
    this.threadService.getThreads().subscribe(
      (threads: Thread[]) => {
        this.threads = threads;
      },
      (error) => {
        console.error('Error fetching threads', error);
      }
    );
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
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
