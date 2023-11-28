import {Component, Input, OnInit} from "@angular/core";
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import { CommentsService} from "./comments.service";
import { Comment } from "./comments";
@Component({
  selector: "app-comments-commentform", //custom html tag{ Comment
  templateUrl: "./commentform.component.html", //path to the HTML file structure
  /*styleUrls: ['../../css/thread_view.css'],
  templateUrl: './thread-view.component.html',*/
})

export class CommentformComponent implements OnInit{
  @Input() threadId!: number;
  @Input() parentCommentId: number = 0;
  commentForm!: FormGroup;
  commentId: number | undefined;

  // makes constructor that links to services and routes
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    private _commentService: CommentsService,
    private _http: HttpClient
  ) {}

  ngOnInit(): void {
    this.parentCommentId = this.parentCommentId || 0;
    this.createForm();
    this._route.queryParams.subscribe(params => {
      this.commentId = params['commentId'] ? +params['commentId'] : undefined;
    });
  }

  // Validator for creating a comment
  createForm(): void{
    this.commentForm = this._formBuilder.group({
      commentBody: ['', Validators.required],
      createdBy: ['', Validators.required],
      threadId: [this.threadId],
      parentCommentId: [this.parentCommentId]
    });
  }
  // sumbits the comment
  onSubmit() {
    // logs the status of the comment
    console.log("CommentCreate form submitted:");
    console.log(this.commentForm);
    console.log('Touched: ', this.commentForm.touched);

    const newComment = this.commentForm.value; //Gets the current values of the commentForm control
    //checks if commentId is undefined
    if (this.commentId !== undefined){
      newComment.commentId = this.commentId;
    }
    //navigates to the URL for creating new comment
    const createUrl = "api/comment/create";
    this._commentService.createComment(newComment).subscribe(response => {
      // checks the response received
      if (response.success){
        console.log(response.message);
        this._router.navigate(["/comments"]);
      }
      else {
        console.log("Comment failed");
      }
      },
      (error) => {
        console.error("Error creating comment:", error);
      }
    );
  }
  backToThreads(){
    this._router.navigate(["/threads"]); //navigates back to the thread
  }

  /*
  deleteComment(comment: Comment){
    const confirmDelete = confirm(`Are you sure you want to delete the comment`);
    if(confirmDelete){
      this._commentService.deleteComment(comment.commentId).subscribe(
        (response)=> {
          if (response.success){
            console.log(response.message("successfuly  deleted"))
          }
        },
        error => {
          console.error("Error deleting comment", error)
        }
      )
    }

  } */

}
