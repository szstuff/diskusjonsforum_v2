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

