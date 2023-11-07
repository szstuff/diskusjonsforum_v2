import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-thread',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.css']
})
export class ThreadComponent implements OnInit {
  thread: any;
  userId: string;
  userIsAdmin: boolean;
  viewTitle: string = 'Thread';

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
