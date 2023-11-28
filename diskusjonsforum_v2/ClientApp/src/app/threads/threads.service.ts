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
  constructor(private _http: HttpClient) { }

  // function for retrieving threads sorted by most recent
  getThreadsByRecent(): Observable<Thread[]> {
    const url = `${this.apiUrl}/getByRecent`;
    return this._http.get<Thread[]>(url);
  }
  // function for retrieving threads sorted by most comments
  getThreadsByComments(): Observable<Thread[]> {
    const url = `${this.apiUrl}/getByComments`;
    return this._http.get<Thread[]>(url);
  }

  // function for filtering/sorting the threads after most comments or most recent thread
  filterBy(option: string): Observable<Thread[]> {
    if (option === 'recent') {
      return this.getThreadsByRecent();
    } else if (option === 'comments') {
      return this.getThreadsByComments();
    } else {
      // Handle other filtering options or default behavior
      return this.getThreads(); // Default to fetching all threads
    }
  }

  // function for fetching all the threads
  getThreads(): Observable<Thread[]> {
    return this._http.get<Thread[]>(`${this.apiUrl}/getall`);
  }

  // function for retrieving a thread
  getThread(threadId: number): Observable<Thread> {
    const url = `${this.apiUrl}/getThread/${threadId}`;
    return this._http.get<Thread>(url);
  }

  // function to retrieve comments belonging to a thread
  getCommentsForThread(threadId: number): Observable<Comment[]> {
    const url = `${this.apiCommentUrl}/getByThread/${threadId}`;
    return this._http.get<Comment[]>(url);
  }

  // function to add comment to a thread
  addCommentToThread(threadId: number, newComment: Comment): Observable<Thread> {
    const url = `${this.apiCommentUrl}/addComment/${threadId}`;
    return this._http.post<Thread>(url, newComment);
  }

  // function for creating a thread
  createThread(newThread: Thread): Observable<any> {
    const createUrl = `${this.apiUrl}/create`;
    return this._http.post<any>(createUrl, newThread);
  }

  // function for updating a thread
  updateThread(thread: Thread): Observable<any>{
    const url = `${this.apiUrl}/update/${thread.threadId}`;
    return this._http.put(url, thread);
  }
  // function for deleting a thread
  deleteThread(threadId: number): Observable<any>{
    const url = `${this.apiUrl}/delete/${threadId}`;
    return this._http.delete(url);
  }
  // function for searching after a thread based on query
  searchThreads(searchQuery: string): Observable<any> {
    const url = `${this.apiUrl}/search?searchQuery=${searchQuery}`;
    return this._http.get(url);
  }

  // function for updating the comment
  updateComment(comment: Comment){
    const url = `${this.apiCommentUrl}/update/${comment.commentId}`;
    return this._http.put(url, comment);
  }

  // function for deleting comment
  deleteComment(commentId: number): Observable<any> {
    const url = `${this.apiCommentUrl}/delete/${commentId}`;
    return this._http.delete<any>(url);
  }
}
