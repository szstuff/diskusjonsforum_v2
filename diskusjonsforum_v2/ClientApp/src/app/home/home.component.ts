import { Component, OnInit } from '@angular/core';
import { ThreadService } from '../threads/threads.service';
import { Thread } from '../threads/threads';
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../css/IndexStyle.css', '../../css/thread_table.css']
})
export class HomeComponent implements OnInit {
  threads: Thread[] = [];

  constructor(
    private threadService: ThreadService,
    private _http: HttpClient,
    private _router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadThreads();
  }

  navigateToThreadform() {
    this._router.navigate(['/threadForm']);
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
}
