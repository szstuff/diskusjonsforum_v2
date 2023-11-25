import {Component} from "@angular/core";
import {FormGroup, FormControl, Validator, FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import { Router} from "@angular/router";
import { CommentsService} from "./comments.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: "app-comments-commentform", templateUrl: "comments.component.html"
})

export class CommentformComponent{
  commentForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _commentService: CommentsService,
    private _http: HttpClient
  )
  {
    this.commentForm = _formBuilder.group({
      comment: ["", Validators.required],
      body: ["", Validators.required]
    });
  }

  onSumbit() {
    console.log("CommentCreate form submitted:");
    console.log(this.commentForm);
    const newComment = this.commentForm.value;
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

  backToComment(){
    this._router.navigate(["/comments"]);
  }

}
