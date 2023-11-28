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

  // function for retrieving comments belonging to a thread
  getCommentsByThreadId(parentThreadId: number): Observable<Comment[]> {
    return this._http.get<Comment[]>(`${this.apiUrl}/getByThread/${parentThreadId}`);
  }

  // function for creating a comment
  createComment(newComment: Comment):Observable<any>{
    const url = `${this.apiUrl}/create`;
    return this._http.post<void>(url, newComment);
  }

  // function for updating a comment by commentId
  updateComment(comment: Comment): Observable<any> {
    const url = `${this.apiUrl}/update/${comment.commentId}`;
    return this._http.put<any>(url, comment);
  }

  // function for deleting a comment
  deleteComment(commentId: number): Observable<any> {
    const url = `${this.apiUrl}/delete/${commentId}`;
    return this._http.delete<any>(url);
  }
}

