import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Comment } from './comments';
import {CommentsService} from "./comments.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";

@Component({
  selector: 'app-comment-component', // custom HTML tag
  templateUrl: './comments.component.html', //path to the HTML file structure
  // styleUrls: ['./comment.component.css']
})

export class CommentsComponent implements OnInit {
  viewTitle: string = "Table";
  comments: Comment[] = [];
  parentThreadId!: number;
 // initialises routes and service for the constructor
  constructor(
              private commentsService : CommentsService,
              private _http: HttpClient,
              private _router: Router,
              private route: ActivatedRoute) {}

  //gets the comments using HttpClient from "api/comments"
  getComments(): void{
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
  getCommentsByThread(): void{
    if (this.parentThreadId !== undefined && this.parentThreadId !== null) {
      this.commentsService.getCommentsByThreadId(this.parentThreadId).subscribe(
        (comments) => (this.comments = comments),
        (error) => console.error('Error fetching comments')
      )
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

    //Routing for getCommentsByThread, fungerer ikke
    /*
    this.route.paramMap.subscribe((params) => {
      this.parentThreadId = + params.get('parentThreadId');
      this.getCommentsByThread();
    });
    */


  }

  // Function to add a comment
  addComment() {
    // Logic to add a comment
  }

  // Function to edit a comment
  editComment(commentId: number) {
    // Logic to edit a comment
  }

  // Function to delete a comment
  deleteComment(commentId: number) {
    // Logic to delete a comment
  }

}
