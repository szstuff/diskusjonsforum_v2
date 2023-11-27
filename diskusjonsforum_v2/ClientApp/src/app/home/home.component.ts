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

  constructor(
    private threadService: ThreadService, //encapsulate functionality linked to ThreadService
    private _http: HttpClient, // sends HTTP requests and receives HTTP responses
    private _router: Router, //lets us nagivate to different routers within the angular application
    private route: ActivatedRoute //informs about the route activated
  ) {}

  ngOnInit(): void {
    this.loadThreads();
  }

  navigateToThreadform() {
    this._router.navigate(['/threadForm']); // navigates to the thread form /threadForm
  }

  // uses threadSerice to load/fetch the threads
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
}
