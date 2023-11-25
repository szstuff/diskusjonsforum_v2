import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Thread } from './threads';
import {ThreadService} from "./threads.service";
import {Router} from "@angular/router";
//import { User } from '../users/users';

@Component({
  selector: 'app-thread-component',
  templateUrl: './threads.component.html',
  // styleUrls: ['./threads.component.css']
})

export class ThreadsComponent implements OnInit {
  threads: Thread[] = [];
  private _listFilter: string = '';
  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    console.log('In setter:', value);
    this.filteredThreads = this.performFilter(value);
  }

  filteredThreads: Thread[] = this.threads;
  constructor(private threadService: ThreadService, private _http: HttpClient, private _router: Router) {}

  getThreads(): void {
    this.threadService.getThreads().subscribe(
      (threads) => {
        this.threads = threads;
        this.filteredThreads = this.threads;
      },
      (error) => console.error('Error getting threads', error)
    );
  }

  performFilter(filterBy: string): Thread[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.threads.filter((thread: Thread) =>
      thread.threadTitle.toLocaleLowerCase().includes(filterBy)
    );
  }

  navigateToThreadform(){
    this._router.navigate(['/threadForm']);
  }

  ngOnInit(): void {
    console.log('ThreadsComponent created');
    this.getThreads();
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
