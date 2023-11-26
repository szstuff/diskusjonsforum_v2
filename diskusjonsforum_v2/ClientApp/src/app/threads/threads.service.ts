import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Thread } from "./threads";

@Injectable({
  providedIn: 'root',
})

export class ThreadService {
  private apiUrl = 'api/threads'; // navigates to the API endpoints for threads
  constructor(private _http: HttpClient) {}

  // Gets all the threads with GET request
  getThreads(): Observable<Thread[]> {
    return this._http.get<Thread[]>(`${this.apiUrl}/getall`);
  }
  // Gets a thread by threadId with GET request
  getThread(threadId: number): Observable<Thread> {
    const url = '${this.apiUrl)/getThread/${threadId}';
    return this._http.get<Thread>(url);
  }
  // Creates a new thread by threatId with POST request
  createThread(newThread: Thread): Observable<any> {
    const createUrl = `${this.apiUrl}/create`;
    return this._http.post<any>(createUrl, newThread);
  }
  // updates the thread by threadId with PUT request
  updateThread(thread: Thread): Observable<any>{
    const url = `${this.apiUrl}/update/${thread.threadId}`;
    return this._http.put(url, thread);
  }
  // deletes a thread by threadId with DELETE request
  deleteThread(threadId: number): Observable<any>{
    const url = `${this.apiUrl}/delete/${threadId}`;
    return this._http.delete(url);
  }
  // searches after a thread based on query with GET request
  searchThreads(searchQuery: string): Observable<any> {
    const url = `${this.apiUrl}/search?searchQuery=${searchQuery}`;
    return this._http.get(url);
  }

}
