import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Thread } from './threads';
import { ThreadService } from "./threads.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-thread-component',
  templateUrl: './threads.component.html',
  styleUrls: ['../../IndexStyle.css','../../thread_table.css']
})

export class ThreadsComponent implements OnInit {
  viewTitle: string = 'Table';
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
  constructor(
    private _threadService: ThreadService,
    private _http: HttpClient,
    private _router: Router,
    private route: ActivatedRoute) { }

  getThreads(): void {
    this._threadService.getThreads()
      .subscribe(data => {
        console.log('All', JSON.stringify(data));
        this.threads = data;
        this.filteredThreads = this.threads;
      },
      (error) => {
        console.error('Error getting threads', error);
        // Handle the error, e.g., display an error message to the user
        // For now, let's log a generic error message to the console
        console.error('An error occurred while fetching threads. Please try again later.');
      }
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

  update(thread: Thread): void {
    this._threadService.updateThread(thread).subscribe(
      ()=>{
        console.log('Thread updated');
      },
      (error) =>{
        console.error('Error updating thread', error);
      }
    );
  }

  delete(threadId: number): void{
    this._threadService.deleteThread(threadId).subscribe(
      ()=>{
        console.log('Thread deleted');
        // Refresh the thread list or perform other actions after deletion
        this.getThreads();
      },
      (error) => {
        console.error('Error deleting thread', error);
      }
    );
  }

  search(searchQuery: string): void {
    this._threadService.searchThreads(searchQuery).subscribe(
      (searchResults) => {
        console.log('Search results', searchResults);
        // Handle the search results as needed
      },
      (error) => {
        console.error('Error searching threads', error);
      }
    );
  }
}
