/*
export interface User {
  UserName: string;
  UserId: string;
  UserIsAdmin: boolean;
}

export interface Comment {
  CommentBody: string;
  CommentId: number;
  UserId: string;
  ChildComments?: Comment[];
}

export interface Thread {
  User: User;
  ThreadComments: Comment[];
  ThreadBody: string;
  ThreadTitle: string;
  ThreadId: number;
}

*/


//import { Category } from "./category";
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
