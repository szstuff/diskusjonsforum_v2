import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ThreadService } from './threads.service';
import { Thread } from './threads';
import { Comment } from '../comments/comments';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {HttpClient} from "@angular/common/http";
@Component({
  selector: 'app-thread-view',
  templateUrl: './thread-view.component.html',
  styleUrls: ['../../css/thread_view.css']
})
export class ThreadViewComponent implements OnInit, OnDestroy {
  commentForm: FormGroup;
  threadForm: FormGroup; // Initialise a FormGroup object
  thread: Thread = {} as Thread;
  newCommentBody: string = '';
  newCommentCreatedBy: string = '';
  isEditing = false;
  editedTitle: string = '';
  editedBody: string = '';

  private unsubscribe$ = new Subject<void>();


  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router, // Initialise router object for navigation
    private route: ActivatedRoute,
    private _threadService: ThreadService,
    private _http: HttpClient)
  {
    this.threadForm = _formBuilder.group({
      // Define FormBuilder input validation rules
      createdBy: ['', Validators.required],
      threadTitle: ['', [Validators.required, Validators.maxLength(100)]],
      threadBody: ['', [Validators.required, Validators.maxLength(2500)]],

    });
    this.commentForm= _formBuilder.group({
      newCommentCreatedBy: ['', Validators.required],
      newCommentBody:  ['', Validators.required]
    })
  }
  // fetches the thread and the comments under the thread
  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(params => {
      const threadId = +params.get('id')!;
      // fetches the thread by threadId
      this._threadService.getThread(threadId).subscribe(
        (thread: Thread) => {
          this.thread = thread;
          // fetches the comment that belongs to the thread by threadId
          this._threadService.getCommentsForThread(threadId).subscribe(
            (comments: Comment[]) => {
              this.thread.threadComments = comments;
            },
            (error) => {
              console.error('Error fetching comments', error);
            }
          );
        },
        (error) => {
          console.error('Error fetching thread', error);
        }
      );
    });
  }
  // makes a constructor that takes in several data for comment. It is used in the HTML "thread-view.component.html" to add the data from the input
  addComment() {
    const newComment = {
      commentId: 0,
      commentBody: this.newCommentBody,
      commentCreatedAt: new Date(),
      commentLastEditedAt:new Date(),
      threadId: this.thread.threadId,
      thread: null,
      parentCommentId: null,
      parentComment: null,
      createdBy: this.newCommentCreatedBy,
      childComments: [],
    };
    this._threadService.addCommentToThread(this.thread.threadId, newComment).subscribe(
      (response) => {
        this.newCommentBody = '';
        this.newCommentCreatedBy = '';
        newComment.commentId = response.commentId;
        this.thread.threadComments!.push(newComment); //Adds new comment to local representation of thread (because the thread is already loaded and would otherwise need to be refreshed)
      },
      (error) => {
        console.error('Error adding comment', error);
      }
    );
  }

  // deletes the thread by threadId
  deletePost(thread: Thread){
    const confirmDelete = confirm(`Are you sure you want to delete "${thread.threadTitle}"`);
    if (confirmDelete){
      this._threadService.deleteThread(thread.threadId).subscribe(
        (response) => {
          if (response.success){
            this._router.navigate(['/']); //Navigate to home page after deleting a thread.
            console.log(response.message);
          }
        },
        error => {
          console.error('Error deleting item', error)
        }
      )
    }
  }

  toggleEdit(thread: Thread) {
    this.isEditing = !this.isEditing;
    this.editedBody = thread.threadBody;
    this.editedTitle = thread.threadTitle;

  }

  // saves the changes made on the thread.
  saveChanges(): void {
    // Perform the logic to save changes, update thread.title and thread.body
    // Call the service method to update the thread
    this.thread.threadTitle = this.editedTitle;
    this.thread.threadBody = this.editedBody;

    this._threadService.updateThread(this.thread).subscribe(
      (response) => {
        console.log('Server response:', response);

        // Update the thread with the response from the server
        if (response.success) {
          this.thread.threadLastEditedAt = response.updatedThread.threadLastEditedAt;

          this.toggleEdit(this.thread);
        } else {
          console.error('Error updating thread. Server response:', response);
        }
      },
      (error) => {
        console.error('Error saving changes', error);
      }
    );
  }


  deleteComment(commentId: number): void {
    this._threadService.deleteComment(commentId).subscribe(
      () => {
        console.log('Comment deleted');

        // This ensure that the UI update gets updated after deletion
        if (this.thread && this.thread.threadComments) {
          this.thread.threadComments = this.thread.threadComments.filter(comment => comment.commentId !== commentId);
        }
      },
      (error) => console.error('Error deleting comment', error)
    );
  }

  toggleEditComment(comment: Comment): void {
    comment.isEditing = !comment.isEditing;
    this.editedBody = comment.commentBody;
  }

  saveChangesComment(comment: Comment, editedBody: string): void {
    if (editedBody !== undefined && editedBody.length >= 1) {
      comment.commentBody = editedBody;
      this._threadService.updateComment(comment).subscribe(
        (response) => {
          console.log("Comment has been updated");
          this.toggleEditComment(comment);
        },
        (error) => {
          console.error('Error saving changes', error);
        }
      );
    } else {
      console.error('Attempted to save changes with undefined editedBody');
    }
  }


  // LastEditedAt value is only displayed when time difference is over 1s (60*1000ms)
  significantTimeDifference(object: any): boolean {
    let timeDiff: number;
    if ("threadCreatedAt" in object) { //If object contains threadCreatedAt field, it must be a thread.
       timeDiff = new Date(object.threadLastEditedAt).getTime() - new Date(object.threadCreatedAt).getTime();
    } else {
       timeDiff = new Date(object.commentLastEditedAt).getTime() - new Date(object.commentCreatedAt).getTime();
    }
    return timeDiff > (60*1000)

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
