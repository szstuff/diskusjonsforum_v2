import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {TThread} from './threads';

@Component({
  selector: 'app-thread-component',
  templateUrl: './threads.component.html',
  //styleUrls: ['./threads.component.css']
})

export class ThreadsComponent implements OnInit{
  viewTitle: string = 'Table';
  threads: TThread[] = [];

  constructor(private _http: HttpClient) { }


  private _listFilter: string = '';
  get listFilter(): string{
    return this._listFilter;
  }
  set listFilter(value: string){
    this._listFilter = value;
    console.log('In setter:', value);
    this.filteredThreads = this.performFilter(value);
  }

  getThreads(): void{
    this._http.get<TThread[]>('api/thread').subscribe(data => {
      console.log('All', JSON.stringify(data));
      this.threads = data;
      this.filteredThreads = this.threads;
    });
  }

  filteredThreads: TThread[] = this.threads;

  performFilter(filterBy: string): TThread[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.threads.filter((thread: TThread) =>
    thread.ThreadTitle.toLocaleLowerCase().includes(filterBy));
  }

  ngOnInit(): void {
    console.log('ThreadsComponent created')
  }

  // Function to add a comment
  addComment() {
    // Logic to add a comment
  }
}
