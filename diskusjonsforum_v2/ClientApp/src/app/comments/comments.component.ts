import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Comment } from './comments';
import {ThreadService} from "../threads/threads.service";
import {Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {CommentsService} from "./comments.service";


//import { User } from '../users/users';

@Component({
  selector: 'app-comment-component',
  templateUrl: './comments.component.html',
  // styleUrls: ['./comment.component.css']
})

export class CommentsComponent implements OnInit {
  viewTitle: string = "Table";
  comments: Comment[] = [];
  //users: User[] = []; // Assuming you want to use the User interface here



  ngOnInit(): void {
    console.log('CommentsComponent created');
    this.getComments();
    // If you want to get users, you can call a method to fetch them here
    // this.getUsers();
  }
  constructor(private commentsService : CommentsService, private _http: HttpClient , private _router: HttpClient) {
  }
  getComments(): void{
    this._http.get<Comment[]>('api/comments').subscribe(data => {
      console.log('All', JSON.stringify(data));
      this.comments = data;
    });
  }



  /*
  getUsers(): void {
    this._http.get<User[]>('api/users').subscribe(data => {
      console.log('All users', JSON.stringify(data));
      this.users = data;
    });
  } */

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
