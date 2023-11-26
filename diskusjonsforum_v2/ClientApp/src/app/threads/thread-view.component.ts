import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThreadsComponent } from './threads.component';
import { ThreadService } from './threads.service';

@Component({
  selector: 'app-thread-view',
  templateUrl: './thread-view.component.html',
  styleUrls: ['./thread-view.component.css']
})
export class ThreadViewComponent implements OnInit {
  thread: ThreadsComponent;

  constructor(private route: ActivatedRoute, private threadService: ThreadService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const threadId = +params.get('id');
      this.threadService.getThreadById(threadId).subscribe(thread => {
        this.thread = thread;
      });
    });
  }
}
