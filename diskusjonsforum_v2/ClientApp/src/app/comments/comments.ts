import { Thread } from "../threads/threads";

export interface Comment {
  commentId: number;
  commentBody: string;
  commentCreatedAt: string;
  commentLastEditedAt: string;
  threadId: number;
  thread: Thread | null;
  parentCommentId: number | null;
  parentComment: Comment | null;
  createdBy: string | null;
}
