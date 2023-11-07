//chatgpt

import { Component, OnInit } from '@angular/core';
//import { CommentService } from './comment.service';
//import { Comment } from './comment.model';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  comments: Comment[] = [];

  constructor(private commentService: CommentService) { }

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.commentService.getComments()
      .subscribe((comments: Comment[]) => {
        this.comments = comments;
      });
  }

  createComment(comment: Comment) {
    this.commentService.createComment(comment)
      .subscribe(() => {
        this.loadComments();
      });
  }

  editComment(comment: Comment) {
    this.commentService.editComment(comment)
      .subscribe(() => {
        this.loadComments();
      });
  }

  deleteComment(comment: Comment) {
    this.commentService.deleteComment(comment)
      .subscribe(() => {
        this.loadComments();
      });
  }
}
