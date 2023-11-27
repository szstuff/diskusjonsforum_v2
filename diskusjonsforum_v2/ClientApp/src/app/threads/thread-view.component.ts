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
  styleUrls: ['../../css/ThreadStyle.css']
})
export class ThreadViewComponent implements OnInit, OnDestroy {
  thread: Thread = {} as Thread;
  newCommentBody: string = '';

  private unsubscribe$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private threadService: ThreadService) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(params => {
      const threadId = +params.get('id')!;

      this.threadService.getThread(threadId).subscribe(
        (thread: Thread) => {
          this.thread = thread;

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

  addComment() {
    const newComment = {
      commentId: 0,
      commentBody: this.newCommentBody,
      commentCreatedAt: '',
      commentLastEditedAt: '',
      threadId: this.thread.threadId,
      thread: null,
      parentCommentId: null,
      parentComment: null,
      createdBy: null,
      childComments: [],
    };

    this.threadService.addCommentToThread(this.thread.threadId, newComment).subscribe(
      (updatedThread: Thread) => {
        this.thread = updatedThread;
        this.newCommentBody = '';
      },
      (error) => {
        console.error('Error adding comment', error);
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
