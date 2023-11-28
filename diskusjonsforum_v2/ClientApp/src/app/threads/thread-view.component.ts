import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { ThreadService } from './threads.service';
import { Thread } from './threads';
import { Comment } from '../comments/comments';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {CommentsService} from "../comments/comments.service";

@Component({
  selector: 'app-thread-view',
  templateUrl: './thread-view.component.html',
  styleUrls: ['../../css/thread_view.css']
})
export class ThreadViewComponent implements OnInit, OnDestroy {
  thread: Thread = {} as Thread;
  newCommentBody: string = '';
  newCommentCreatedBy: string = '';
  isEditing = false;
  editedTitle!: string;
  editedContent!: string;
  comments: Comment[] = [];

  private unsubscribe$ = new Subject<void>();

  constructor(private route: ActivatedRoute,
              private threadService: ThreadService,
              private commentsService: CommentsService,
              private router: Router) {}
  // fetches the thread and the comments under the thread
  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(params => {
      const threadId = +params.get('id')!;
      // fetches the thread by threadId
      this.threadService.getThread(threadId).subscribe(
        (thread: Thread) => {
          this.thread = thread;
          // fetches the comment that belongs to the thread by threadId
          this.threadService.getCommentsForThread(threadId).subscribe(
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

    this.threadService.addCommentToThread(this.thread.threadId, newComment).subscribe(
      (updatedThread: Thread) => {
        this.thread = updatedThread;
        this.newCommentBody = '';
        this.newCommentCreatedBy = '';

        // Refresh comments for the current thread
        this.getCommentsByThread();

        // Redirect back to the thread view page
        this.router.navigate(['/thread-view/', {id: this.thread.threadId}]);
      },
      (error) => {
        console.error('Error adding comment', error);
      }
    );
  }

  // Refresh comments for the current thread
  getCommentsByThread() {
    this.commentsService.getCommentsByThreadId(this.thread.threadId).subscribe(
      (comments) => {
        this.comments = comments;
      },
      (error) => {
        console.error('Error fetching comments', error);
      }
    );
  }

  // deletes the thread by threadId
  deletePost(thread: Thread){
    const confirmDelete = confirm(`Are you sure you want to delete "${thread.threadTitle}"`);
    if (confirmDelete){
      this.threadService.deleteThread(thread.threadId).subscribe(
        (response) => {
          if (response.success){
            console.log(response.message);
          }
        },
        error => {
          console.error('Error deleting item', error)
        }
      )
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveChanges(): void {
    // Perform the logic to save changes, update thread.title and thread.body
    // Call the service method to update the thread
    this.thread.threadTitle = this.editedTitle;
    this.thread.threadBody = this.editedContent;

    this.threadService.updateThread(this.thread).subscribe(
      (response) => {
        console.log(response.message);
        // Reset isEditing flag after successful save
        this.isEditing = false;
      },
      (error) => {
        console.error('Error saving changes', error);
      }
    );
  }

  cancelEdit(): void {
    // Reset editedTitle and editedContent with the current values
    this.editedTitle = this.thread.threadTitle;
    this.editedContent = this.thread.threadBody;
    // Reset isEditing flag
    this.isEditing = false;
  }

  deleteComment(commentId: number): void {
    this.threadService.deleteComment(commentId).subscribe(
      () => {
        console.log('Comment deleted');
      },
      (error) => console.error('Error deleting comment', error)
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  protected readonly CommentsService = CommentsService;
}
