import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThreadService } from './threads.service';
import { Thread } from './threads';
import { Comment } from '../comments/comments';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-thread-view',
  templateUrl: './thread-view.component.html',
  styleUrls: ['../../css/thread_view.css']
})
export class ThreadViewComponent implements OnInit, OnDestroy {
  thread: Thread = {} as Thread;
  newCommentBody: string = '';
  newCommentCreatedBy: string = '';

  private unsubscribe$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private threadService: ThreadService) {}
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
  // makes a constructor that takes in several data. It is used in the HTML "thread-view.component.html" to add the data from the input
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
  // adds the new comments to the thread it belongs to by the threadId
    this.threadService.addCommentToThread(this.thread.threadId, newComment).subscribe(
      (updatedThread: Thread) => {
        this.thread = updatedThread;
        this.newCommentBody = '';
        this.newCommentCreatedBy = '';
      },
      (error) => {
        console.error('Error adding comment', error);
      }
    );
  }

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


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
