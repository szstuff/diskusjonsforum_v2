import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThreadsComponent } from './threads.component';
import { ThreadService } from './threads.service';
import {Thread} from "./threads";

@Component({
  selector: 'app-thread-view', // custom HTML tag
  templateUrl: './thread-view.component.html', // path to the template
  //styleUrls: ['./thread-view.component.css']
})
export class ThreadViewComponent implements OnInit {
  thread: Thread = {} as Thread; //initialise thread object

  // provides ActivatedRoute and ThreadService as route and threadservice
  constructor(private route: ActivatedRoute, private threadService: ThreadService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      // @ts-ignore, thread ID will not be null
      const threadId = +params.get('id');
      // gets details on the corresponding thread by using "this.threadService" and
      // updates the property in the component of "thread" with this.thread
      this.threadService.getThread(threadId).subscribe(thread => {
        this.thread = thread;
      });
    });
  }
}
