import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Comment } from './comments';
import {CommentsService} from "./comments.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";

@Component({
  selector: 'app-comment-component',
  templateUrl: './comments.component.html'//path to the HTML file structure
})

export class CommentsComponent implements OnInit {
  viewTitle: string = "Table";
  comments: Comment[] = [];
  parentThreadId!: number;
  isEditing = false;

  // initialises routes and service for the constructor
  constructor(
    private commentsService: CommentsService,
    private _http: HttpClient,
    private _router: Router,
    private _commentService: CommentsService) {
  }

  //gets the comments using HttpClient from "api/comments"
  getComments(): void {
    this._http.get<Comment[]>('api/comments').subscribe(data => {
        console.log('All', JSON.stringify(data));
        this.comments = data;
      },
      (error) => {
        console.error('Error getting comments', error);
        // Handle the error, e.g., display an error message to the user
        // For now, let's log a generic error message to the console
        console.error('An error occurred while fetching comments. Please try again later.')
      });
  }

  // retrieves the comments that belongs to the thread by threadId with an if statement
  getCommentsByThread(): void {
    if (this.parentThreadId !== undefined && this.parentThreadId !== null) {
      this.commentsService.getCommentsByThreadId(this.parentThreadId).subscribe(
        (comments) => (this.comments = comments))
    } else {
      // if the parentThreadId is null or not defined the error is handled and the errormessage is logged to the console
      console.error('Cannot fetch comments, parentThreadId is undefined.')
    }
  }

  // gives the comment an commentId and sets parentThreadID to the thread it belongs to
  navigateToCommentform(comment?: Comment) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        commentId: comment ? comment.commentId.toString() : undefined,
        parentThreadId: this.parentThreadId.toString()
      }
    };
    // navigates to /commentForm and specified nagivationExtras
    this._router.navigate(['/commentForm'], navigationExtras);
  }

  ngOnInit(): void {
    console.log('CommentsComponent created');
    this.getComments();
  }
  updateComment(comment: Comment): void {
    this.commentsService.updateComment(comment).subscribe(
      () => {
        console.log('Comment updated');
        this.getCommentsByThread(); // Refresh comments after update
      },
      (error) => console.error('Error updating comment', error)
    );
  }

  deleteComment(commentId: number): void {
    this.commentsService.deleteComment(commentId).subscribe(
      () => {
        console.log('Comment deleted');
        this.getCommentsByThread(); // Refresh comments after deletion
      },
      (error) => console.error('Error deleting comment', error)
    );
  }
}
