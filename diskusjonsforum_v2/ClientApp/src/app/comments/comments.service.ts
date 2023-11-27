import { Injectable } from '@angular/core';
import { Observable} from "rxjs";
import {Comment} from "./comments";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private apiUrl = 'api/comments'; // navigates to the API endpoints for comments
  constructor(private _http: HttpClient) { }

  getCommentsByThreadId(parentThreadId: number): Observable<Comment[]> {
    return this._http.get<Comment[]>(`${this.apiUrl}/getByThread/${parentThreadId}`);
  }

  //creates a new comment
  createComment(newComment: Comment):Observable<any>{
    const url = `${this.apiUrl}/create`;
    return this._http.post<void>(url, newComment);
  }

  // updates the comment
  updateComment(comment: Comment): Observable<any> {
    const url = `${this.apiUrl}/update/${comment.commentId}`;
    return this._http.put<any>(url, comment);
  }

  // deletes comment by commentID
  deleteComment(commentId: number): Observable<any> {
    const url = `${this.apiUrl}/deleteComment/${commentId}`;
    return this._http.delete<any>(url);
  }
}

