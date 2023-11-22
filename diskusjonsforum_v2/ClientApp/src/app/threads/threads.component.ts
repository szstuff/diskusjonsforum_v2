import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Thread} from '../../../../Models/Thread.cs';

@Component({
  selector: 'app-thread',
  templateUrl: './threads.component.html',
  //styleUrls: ['./threads.component.css']
})
export class ThreadsComponent implements OnInit {
  viewTitle: string = 'Table';

  thread: Thread = new Thread();
  userId: string = ''; //Initialize user Id
  userIsAdmin: boolean = false;  // and userIsAdmin

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.userId = ''; // Fetch the current user's ID
    this.userIsAdmin = false; // Check if the user is an admin

    // Fetch thread details
    this.http.get<any>('api/threads/threadId').subscribe((thread) => {
      this.thread = thread;
    });
  }

  // Function to add a comment
  addComment() {
    // Logic to add a comment
  }

  // Function to edit a comment
  editComment(commentId: number) {
    // Logic to edit a comment
  }

  // Function to delete a comment
  deleteComment(commentId: number) {
    // Logic to delete a comment
  }
}
