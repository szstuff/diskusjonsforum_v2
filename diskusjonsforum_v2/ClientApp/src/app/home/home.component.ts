import { Component, OnInit } from '@angular/core';
import { ThreadService } from '../threads/threads.service';
import { Thread } from '../threads/threads'; // Adjust the path accordingly

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../css/IndexStyle.css','../../css/thread_table.css']
})

export class HomeComponent implements OnInit {
  threads: Thread[] = []; //empty array to store threads

  constructor(private threadService: ThreadService) {} //fetches data related to threads

  ngOnInit(): void { // calls loadThreads when it is initialized
    this.loadThreads();
  }

  loadThreads() { // gets the threads
    this.threadService.getThreads().subscribe(
      (threads: Thread[]) => {
        this.threads = threads;
      },
      (error) => { // if there is a problem fetching the thread an error occurs with a error message
        console.error('Error fetching threads', error);
      }
    );
  }

  redirectToCreatePage() { // navigates to "/Thread/Create"
    window.location.href = '/Thread/Create';
  }
}
