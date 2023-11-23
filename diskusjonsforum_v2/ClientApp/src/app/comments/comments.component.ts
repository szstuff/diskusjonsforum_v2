import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Comment } from './comments';

@Component({
  selector: 'app-comment-component',
  templateUrl: './comments.component.html',
  //styleUrls: ['./comment.component.css']
})

export class CommentsComponent implements OnInit {
  comments: Comment[] = [];

  constructor(private _http: HttpClient) { }

  ngOnInit(): void {
    console.log('CommentsComponent created')
    this.getComments();
  }

  getComments(): void{
    this._http.get<Comment[]>('api/comments').subscribe(data => {
      console.log('All', JSON.stringify(data));
      this.comments = data;
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
