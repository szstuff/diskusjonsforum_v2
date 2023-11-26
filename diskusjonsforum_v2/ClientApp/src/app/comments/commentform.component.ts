import {Component} from "@angular/core";
import { FormControl, FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import { CommentsService} from "./comments.service";

@Component({
  selector: "app-comments-commentform",
  templateUrl: "./comments.component.html"
})

export class CommentformComponent{
  commentForm: FormGroup;
  commentId: number | undefined;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    private _commentService: CommentsService,
    private _http: HttpClient
  ) {
    this.commentForm = _formBuilder.group({
      comment: ['', Validators.required],
      body: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      this.commentId = params['commentId'] ? +params['commentId'] : undefined;
    });
  }

  onSubmit() {
    console.log("CommentCreate form submitted:");
    console.log(this.commentForm);
    console.log(this.commentForm.touched);
    const newComment = this.commentForm.value;

    if (this.commentId !== undefined){
      newComment.commentId = this.commentId;
    }
    const createUrl = "api/comment/create";
    this._commentService.createComment(newComment).subscribe(response => {
      if (response.success){
        console.log(response.message);
        this._router.navigate(["/comments"]);
      }
      else {
        console.log("Comment failed");
      }
    })
  };

  backToThreads(){
    this._router.navigate(["/threads"]);
  }

}
