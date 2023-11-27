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

  constructor(
              private commentsService : CommentsService, //provides methods from CommentService for interaction with the API
              private _http: HttpClient, // sends HTTP requests and receives HTTP responses
              private _router: Router, // allows us to navigate through different views
              private route: ActivatedRoute) {} // gives us info about the current activated route
  getComments(): void{ //gets the comments using HttpClient from "api/comments"
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

  getCommentsByThread(): void{ // Gets comments based on the "parentThreadId" by using CommentService and updates the array.
    if (this.parentThreadId !== undefined && this.parentThreadId !== null) { // it gets the comment and updates the array if the parentThreadId is defined
      this.commentsService.getCommentsByThreadId(this.parentThreadId).subscribe(
        (comments) => (this.comments = comments),
        (error) => console.error('Error fetching comments')
      )
    } else { // if the parentThreadId is null or not defined the error is handled and the errormessage is logged to the console
      console.error('Cannot fetch comments, parentThreadId is undefined.')
    }
  }

  navigateToCommentform(comment?: Comment){
    const navigationExtras: NavigationExtras = {
      //sets the parameters, if there is an object, an object with single propert "commentId" is created with the string "commentId".
      // if there is no comment the parameter is set undefined
      queryParams: comment ? {commentId: comment.commentId.toString()} : undefined
    };
    this._router.navigate(['/commentForm'], navigationExtras); //navigates to commentForm
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
