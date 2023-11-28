import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Thread } from "./threads";
import { Comment } from '../comments/comments'

@Injectable({
  providedIn: 'root',
})

export class ThreadService {
  private apiUrl = 'api/threads';
  private apiCommentUrl = 'api/comments';
  constructor(private _http: HttpClient) {}

  // Gets all the threads with GET request
  getThreads(): Observable<Thread[]> {
    return this._http.get<Thread[]>(`${this.apiUrl}/getall`);
  }

  getThread(threadId: number): Observable<Thread> {
    const url = `${this.apiUrl}/getThread/${threadId}`;
    return this._http.get<Thread>(url);
  }

  // New method to get comments for a thread
  getCommentsForThread(threadId: number): Observable<Comment[]> {
    const url = `${this.apiCommentUrl}/getByThread/${threadId}`;
    return this._http.get<Comment[]>(url);
  }
  addCommentToThread(threadId: number, newComment: Comment): Observable<Thread> {
    const url = `${this.apiCommentUrl}/addComment/${threadId}`;
    return this._http.post<Thread>(url, newComment);
  }

  createThread(newThread: Thread): Observable<any> {
    const createUrl = `${this.apiUrl}/create`;
    return this._http.post<any>(createUrl, newThread);
  }

  // updates the thread by threadId with PUT request
  updateThread(thread: Thread): Observable<any>{
    const url = `${this.apiUrl}/update/${thread.threadId}`;
    return this._http.put(url, thread);
  }
  // deletes a thread by threadId with DELETE request
  deleteThread(threadId: number): Observable<any>{
    const url = `${this.apiUrl}/delete/${threadId}`;
    return this._http.delete(url);
  }
  // searches after a thread based on query with GET request
  searchThreads(searchQuery: string): Observable<any> {
    const url = `${this.apiUrl}/search?searchQuery=${searchQuery}`;
    return this._http.get(url);
  }

  updateComment(comment: Comment){
    const url = `${this.apiCommentUrl}/update/${comment.commentId}`;
    return this._http.put(url, comment);
  }
  deleteComment(commentId: number): Observable<any> {
    const url = `${this.apiCommentUrl}/delete/${commentId}`;
    return this._http.delete<any>(url);
  }
}
