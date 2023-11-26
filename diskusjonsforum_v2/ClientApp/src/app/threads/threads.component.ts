import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Thread } from './threads';
import { ThreadService } from "./threads.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-thread-component', // custom HTML tag
  templateUrl: './threads.component.html', // path to the HTML file structure
  styleUrls: ['../../css/IndexStyle.css','../../css/thread_table.css'] // path to the css file
})

export class ThreadsComponent implements OnInit {
  viewTitle: string = 'Table';
  threads: Thread[] = []; // sets an empty array to store the threads
  private _listFilter: string = '';

  // Getter for the listfilter
  get listFilter(): string {
    return this._listFilter;
  }
  // Setter  for the listFilter
  set listFilter(value: string) {
    this._listFilter = value;
    console.log('In setter:', value);
    this.filteredThreads = this.performFilter(value); // updates the filtered threads with the value coming in from this.performFilter(Value)
  }
  // updates/stores the array with threads after it has been filtered
  filteredThreads: Thread[] = this.threads;
  constructor(
    private _threadService: ThreadService, //encapsulate functionality linked to CommentService
    private _http: HttpClient, // sends HTTP requests and receives HTTP responses
    private _router: Router, //lets us nagivate to different routers within the angular application
    private route: ActivatedRoute) { } //informs about the route activated
  // gets threads from the ThreadService
  getThreads(): void {
    // calls getThreads of the _threadService
    this._threadService.getThreads()
      .subscribe(data => {
        console.log('All', JSON.stringify(data));
        this.threads = data; //the data is assigned to the threads property
        this.filteredThreads = this.threads; // updating the property of filteredThread
      },
      (error) => {
        console.error('Error getting threads', error);
        // Handle the error, e.g., display an error message to the user
        // For now, let's log a generic error message to the console
        console.error('An error occurred while fetching threads. Please try again later.');
      }
    );
  }

  // Filters the threads
  performFilter(filterBy: string): Thread[] {
    filterBy = filterBy.toLocaleLowerCase();  // converts the string to lowercase
    return this.threads.filter((thread: Thread) =>
      // checks if the lowercase ver in threadTitle
      // contains the lowercase ver of filterby. If it does
      // the thread matches the criteria for filtering
      thread.threadTitle.toLocaleLowerCase().includes(filterBy)
    );
  }

  navigateToThreadform(){
    this._router.navigate(['/threadForm']); // navigates to the thread form
  }

  ngOnInit(): void {
    console.log('ThreadsComponent created'); // logs to the console that threadscomponent has been created
    this.getThreads(); // refreshes
  }

  // updates the thread
  update(thread: Thread): void {
    // calls on updateThread
    this._threadService.updateThread(thread).subscribe(
      ()=>{
        console.log('Thread updated'); // logs to the console if the thread is successfully updatet
      },
      (error) =>{
        console.error('Error updating thread', error); // an error message occurs if the thread is not successfully updatet
      }
    );
  }

  // deleting a thread
  delete(threadId: number): void{
    // calls on deleteThread
    this._threadService.deleteThread(threadId).subscribe(
      ()=>{
        console.log('Thread deleted'); // logs to the console if the thread is successfully deleted
        // Refresh the thread list or perform other actions after deletion
        this.getThreads();
      },
      (error) => { // if it doesn't successfully delete an error message occurs
        console.error('Error deleting thread', error);
      }
    );
  }

  // method to search threads
  search(searchQuery: string): void {
    this._threadService.searchThreads(searchQuery).subscribe(
      (searchResults) => { // starts a search operation
        console.log('Search results', searchResults); // logs to console if the search was successful
        // Handle the search results as needed
      },
      (error) => { // an error message occurs if the search is not successful
        console.error('Error searching threads', error);
      }
    );
  }
}
