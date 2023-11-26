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

  getCommentsByThreadId(parentThreadId: number): Observable<Comment[]> {
    return this._http.get<Comment[]>(`${this.apiUrl}/getByThread/${parentThreadId}`);
  }

  createComment(newComment: Comment):Observable<any>{
    const url = `${this.apiUrl}/create`;
    return this._http.post<any>(url, newComment);
  }

  updateComment(comment: Comment): Observable<any> {
    const url = `${this.apiUrl}/update/${comment.commentId}`;
    return this._http.put<any>(url, comment);
  }

  deleteComment(commentId: number): Observable<any> {
    const url = `${this.apiUrl}/deleteComment/${commentId}`;
    return this._http.delete<any>(url);
  }
}

