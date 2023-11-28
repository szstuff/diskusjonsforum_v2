import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Thread } from './threads';
import { ThreadService } from "./threads.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-thread-component',
  templateUrl: './threads.component.html', // path to the HTML file structure
  styleUrls: ['../../css/IndexStyle.css','../../css/thread_table.css'] // path to the css file
})

export class ThreadsComponent implements OnInit {
  viewTitle: string = 'Table';
  threads: Thread[] = [];
  private _listFilter: string = '';

  // calls on the filtered list
  get listFilter(): string {
    return this._listFilter;
  }
  // filters the threads depending on the "value" and updates the list
  set listFilter(value: string) {
    this._listFilter = value;
    console.log('In setter:', value);
    this.filteredThreads = this.performFilter(value);
  }
  // stores the filtered list in an array
  filteredThreads: Thread[] = this.threads;

  // initialises routes and service for the constructor
  constructor(
    private _threadService: ThreadService,
    public _http: HttpClient,
    private _router: Router) { }
 // retrieves the threads by calling on the service and updates the list to display the threads
  getThreads(): void {
    // calls getThreads of the _threadService
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

  // converts the string to lowercase and returns the l
  performFilter(filterBy: string): Thread[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.threads.filter((thread: Thread) =>
      thread.threadTitle.toLocaleLowerCase().includes(filterBy)
    );
  }

  navigateToThreadform(){
    this._router.navigate(['/threadForm']); // navigates to the thread form
  }

  navigateToHome() {
    this._router.navigate(['/home']);
  }

  ngOnInit(): void {
    console.log('ThreadsComponent created'); // logs to the console that threadscomponent has been created
    this.getThreads(); // refreshes
  }

  // updates the threads and logs it in the console by calling on updateThread from threads service
  update(thread: Thread): void {
    this._threadService.updateThread(thread).subscribe(
      ()=>{
        console.log('Thread updated');
        this.getThreads();
      },
      (error) =>{
        console.error('Error updating thread', error);
      }
    );
  }

  // deleting a thread and logs it to the console. after deleting, the website refreshes with the nondeleted threads
  // deletes by calling on deleteThread from the service
  delete(threadId: number): void{
    this._threadService.deleteThread(threadId).subscribe(
      ()=>{
        console.log('Thread deleted');
        this.getThreads();
      },
      (error) => {
        console.error('Error deleting thread', error);
      }
    );
  }
}
