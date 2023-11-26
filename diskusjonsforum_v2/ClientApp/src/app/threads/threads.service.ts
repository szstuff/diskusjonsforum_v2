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
    const createUrl = 'api/thread/create';
    return this._http.post<any>(createUrl, newThread);
  }

  updateThread(thread: Thread): Observable<any>{
    const url ='api/thread/update/${thread.id}';
    return this._http.put(url, thread);
  }

  deleteThread(threadId: number): Observable<any>{
    const url = `api/thread/delete/${threadId}`;
    return this._http.delete(url);
  }

  searchThreads(searchQuery: string): Observable<any> {
    const url = `api/thread/search?searchQuery=${searchQuery}`;
    return this._http.get(url);
  }

}
