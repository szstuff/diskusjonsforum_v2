import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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

}
