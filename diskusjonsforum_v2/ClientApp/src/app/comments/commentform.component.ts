import {Component} from "@angular/core";
import { FormControl, FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import { CommentsService} from "./comments.service";

@Component({
  selector: "app-comments-commentform", //custom html tag
  templateUrl: "./commentform.component.html" //path to the HTML file structure
})

export class CommentformComponent {
  commentForm: FormGroup;
  commentId: number | undefined; //identifier for comment

  constructor(
    private _formBuilder: FormBuilder, //the form for creating a comment
    private _router: Router, //lets us nagivate to different routers within the angular application
    private _route: ActivatedRoute, //informs about the route activated
    private _commentService: CommentsService, //encapsulate functionality linked to CommentService
    private _http: HttpClient // sends HTTP requests and receives HTTP responses
  ) {

    this.commentForm = _formBuilder.group({ //capture input when submitting a comment
      comment: ['', Validators.required], //makes sure input is not empty
      body: ['', Validators.required] //makes sure input is not empty
    });
  }

  ngOnInit(): void { //ngOnInit is a lifecycle hook
    this._route.queryParams.subscribe(params => { //subscribes to queryParams. refers to ActivatedRoute
      this.commentId = params['commentId'] ? +params['commentId'] : undefined; //checks if commentId exists and assign its value to this.commentId if it do. If the commentId doesn't exist the value is set undefined.
    });
  }

  onSubmit() {
    console.log("CommentCreate form submitted:"); //Logs that the comment form is being submitted
    console.log(this.commentForm); //Logs the commentForm object also controls and their current values
    console.log(this.commentForm.touched); //Logs if the commentForm control has been touched or not
    const newComment = this.commentForm.value; //Gets the current values of the commentForm control

    if (this.commentId !== undefined){ //checks if commentId is undefined
      newComment.commentId = this.commentId; //if it is undefined CommentId is added to the object newComment
    }
    const createUrl = "api/comment/create"; //navigates to the URL for creating new comment
    this._commentService.createComment(newComment).subscribe(response => { //makes http post request with the data from newComment
      if (response.success){ //check if the post request is successful
        console.log(response.message); //Logs a success message if the post request is successful
        this._router.navigate(["/comments"]);
      }
      else {
        console.log("Comment failed"); //if not successfull a a failed success message is logged
      }
    })
  };

  backToThreads(){
    this._router.navigate(["/threads"]); //navigates back to the thread
  }

}
