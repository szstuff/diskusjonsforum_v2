import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TThread } from './threads';
import { User } from '../users/users';

@Component({
  selector: 'app-thread-component',
  templateUrl: './threads.component.html',
  // styleUrls: ['./threads.component.css']
})

export class ThreadsComponent implements OnInit {
  viewTitle: string = 'Table';
  threads: TThread[] = [];
  users: User[] = [];

  private _listFilter: string = '';
  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    console.log('In setter:', value);
    this.filteredThreads = this.performFilter(value);
  }

  filteredThreads: TThread[] = this.threads;

  constructor(private _http: HttpClient) {}

  getThreads(): void {
    this._http.get<TThread[]>('api/thread').subscribe(data => {
      console.log('All', JSON.stringify(data));
      this.threads = data;
      this.filteredThreads = this.threads;
    });
  }

  getUsers(): void {
    this._http.get<User[]>('api/users').subscribe(data => {
      console.log('All users', JSON.stringify(data));
      this.users = data;
    });
  }

  performFilter(filterBy: string): TThread[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.threads.filter((thread: TThread) =>
      thread.ThreadTitle.toLocaleLowerCase().includes(filterBy)
    );
  }

  ngOnInit(): void {
    console.log('ThreadsComponent created');
    this.getThreads();
    this.getUsers();
  }

  // Placeholder for adding a comment
  addComment() {
    // Placeholder for adding a comment logic
    console.log('Add Comment logic');
  }

  // Placeholder for editing a comment
  editComment(commentId: number) {
    // Placeholder for editing a comment logic
    console.log(`Edit Comment logic for Comment ID: ${commentId}`);
  }

  // Placeholder for deleting a comment
  deleteComment(commentId: number) {
    // Placeholder for deleting a comment logic
    console.log(`Delete Comment logic for Comment ID: ${commentId}`);
  }
}
