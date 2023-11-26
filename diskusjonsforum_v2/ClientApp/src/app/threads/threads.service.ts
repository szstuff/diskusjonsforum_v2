import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Thread } from "./threads";

@Injectable({
  providedIn: 'root',
})

export class ThreadService {
  private apiUrl = 'api/threads';
  constructor(private _http: HttpClient) {}

  getThreads(): Observable<Thread[]> {
    return this._http.get<Thread[]>(`${this.apiUrl}/getall`);
  }

  getThread(threadId: number): Observable<Thread> {
    const url = '${this.apiUrl)/getThread/${threadId}';
    return this._http.get<Thread>(url);
  }

  createThread(newThread: Thread): Observable<any> {
    const createUrl = `${this.apiUrl}/create`;
    return this._http.post<any>(createUrl, newThread);
  }

  updateThread(thread: Thread): Observable<any>{
    const url = `${this.apiUrl}/update/${thread.threadId}`;
    return this._http.put(url, thread);
  }

  deleteThread(threadId: number): Observable<any>{
    const url = `${this.apiUrl}/delete/${threadId}`;
    return this._http.delete(url);
  }

  searchThreads(searchQuery: string): Observable<any> {
    const url = `${this.apiUrl}/search?searchQuery=${searchQuery}`;
    return this._http.get(url);
  }

}
