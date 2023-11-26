import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThreadsComponent } from './threads.component';
import { ThreadService } from './threads.service';
import {Thread} from "./threads";

@Component({
  selector: 'app-thread-view',
  templateUrl: './thread-view.component.html',
  //styleUrls: ['./thread-view.component.css']
})
export class ThreadViewComponent implements OnInit {
  thread: Thread = {} as Thread; //initialise thread object

  constructor(private route: ActivatedRoute, private threadService: ThreadService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      // @ts-ignore, thread ID will not be null
      const threadId = +params.get('id');
      this.threadService.getThread(threadId).subscribe(thread => {
        this.thread = thread;
      });
    });
  }
}
