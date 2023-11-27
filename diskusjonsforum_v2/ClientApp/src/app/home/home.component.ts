import { Component, OnInit } from '@angular/core';
import { ThreadService } from '../threads/threads.service';
import { Thread } from '../threads/threads';
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";


@Component({
  selector: 'app-home', // custom HTML tag
  templateUrl: './home.component.html', //path to the HTML file structure
  styleUrls: ['../../css/IndexStyle.css', '../../css/thread_table.css'] // template for css file
})
export class HomeComponent implements OnInit {
  threads: Thread[] = [];
  // initialises routes and service for the constructor
  constructor(
    private threadService: ThreadService,
    private _http: HttpClient,
    private _router: Router,
    private route: ActivatedRoute
  ) {}
  // initializes the data
  ngOnInit(): void {
    this.loadThreads();
  }
  navigateToThreadform() {
    this._router.navigate(['/threadForm']);
  }

  // loads the threads by calling getThreads from threadService
  loadThreads() {
    this.threadService.getThreads().subscribe(
      (threads: Thread[]) => {
        this.threads = threads; // updates the threads with the fetched data
      },
      (error) => {
        console.error('Error fetching threads', error); //error is logged if it occurs
      }
    );
  }
}
