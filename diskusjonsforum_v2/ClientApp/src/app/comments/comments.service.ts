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
    return this._http.post<any>(url, newComment); // makes a Post request with the data from the new comment
  }

  updateComment(comment: Comment): Observable<any> { // updates the comment that already exists
    const url = `${this.apiUrl}/update/${comment.commentId}`;
    return this._http.put<any>(url, comment); // makes a PUT request  with the updated comment
  }

  deleteComment(commentId: number): Observable<any> { // deletes comment by specified commentId
    const url = `${this.apiUrl}/deleteComment/${commentId}`;
    return this._http.delete<any>(url); // makes a DELETE request
  }
}

