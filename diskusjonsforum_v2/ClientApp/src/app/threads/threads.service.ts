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
    return this._http.get<Thread[]>(this.apiUrl);
  }

  createThread(newThread: Thread): Observable<any> {
    const createUrl = 'api/thread/create';
    return this._http.post<any>(createUrl, newThread);
  }

}
