import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Comment } from './comments';
import {CommentsService} from "./comments.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";

@Component({
  selector: 'app-comment-component',
  templateUrl: './comments.component.html',
  // styleUrls: ['./comment.component.css']
})

export class CommentsComponent implements OnInit {
  viewTitle: string = "Table";
  comments: Comment[] = [];

  constructor(private commentsService : CommentsService,
              private _http: HttpClient,
              private _router: Router,
              private route: ActivatedRoute) {
  }
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

  navigateToCommentform(comment?: Comment){
    const navigationExtras: NavigationExtras = {
      queryParams: comment ? {commentId: comment.commentId.toString()} : undefined
    };
    this._router.navigate(['/commentForm'], navigationExtras);
  }
  ngOnInit(): void {
    console.log('CommentsComponent created');
    this.getComments();
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
