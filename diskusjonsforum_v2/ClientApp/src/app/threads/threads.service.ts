import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Thread} from "./threads";

@Injectable({
  providedIn: 'root',
})

export class ThreadService {
  private apiUrl = 'api/threads';
  constructor(private http: HttpClient) {}

  getThreads(): Observable<Thread[]> {
    return this.http.get<Thread[]>(`${this.apiUrl}/getall`);
  }
}
