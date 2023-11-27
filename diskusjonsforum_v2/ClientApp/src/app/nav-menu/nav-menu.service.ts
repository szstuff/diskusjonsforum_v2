import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Thread } from '../threads/threads';
//
@Injectable({
  providedIn: 'root'
})
export class NavMenuService {
  private apiUrl = 'api/threads';

  constructor(private _http: HttpClient) {}

  searchThreads(searchTerm: string): Observable<any> {
    const url = `${this.apiUrl}/search/${searchTerm}`;
    return this._http.get<any>(url);
  }

  getThreads(): Observable<Thread[]> {
    return this._http.get<Thread[]>(`${this.apiUrl}/getall`);
  }
}
