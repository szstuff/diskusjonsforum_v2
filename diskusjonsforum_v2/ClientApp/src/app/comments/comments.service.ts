import { Injectable } from '@angular/core';
import { Observable} from "rxjs";
import {Comment} from "./comments";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private apiUrl = 'api/comments';
  constructor(private _http: HttpClient) { }

  getComments(): Observable<Comment[]> {
    return this._http.get<Comment[]>(this.apiUrl);
  }

  createComment(newComment: Comment):Observable<any>{
    const createUrl ="api/comment/create";
    return this._http.post<any>(createUrl, newComment);
  }
}


