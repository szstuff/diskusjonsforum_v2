import { Component, OnInit } from '@angular/core';
import { ThreadService } from '../threads/threads.service';
import { Thread } from '../threads/threads'; // Adjust the path accordingly

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})

export class HomeComponent implements OnInit {
  threads: Thread[] = [];

  constructor(private threadService: ThreadService) {}

  ngOnInit(): void {
    this.loadThreads();
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

  redirectToCreatePage() {
    window.location.href = '/Thread/Create';
  }
}
