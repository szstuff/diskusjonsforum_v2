import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Comment } from './comments';
import {TThread} from "../threads/threads"; // Replace with the correct path to your Comment model
//import { CommentService } from './comment.service'; // Replace with the correct path to your CommentService

@Component({
  selector: 'app-comment-component',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})

export class CommentComponent implements OnInit {
  comments: Comment[] = [];

  constructor(private _http: HttpClient, private commentService: CommentService) { }

  getComments(): void{
    this._http.get<Comment[]>('api/comments').subscribe(data => {
      console.log('All', JSON.stringify(data));
      this.comments = data;
    });
  }

  ngOnInit(): void {
    console.log('CommentsComponent created')
    this.loadComments();
  }

  loadComments() {
    this.commentService.getComments()
      .subscribe((comments: Comment[]) => {
        this.comments = comments;
      });
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
