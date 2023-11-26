import { Comment } from "../comments/comments";

export interface Thread {
  threadId: number;
  threadTitle: string;
  threadBody: string;
  threadCreatedAt: string;
  threadLastEditedAt: string;
  createdBy: string | null;
  threadComments: Comment[] | null;
}
