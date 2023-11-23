export interface Comment {
  User: {
    UserName: string;
    UserIsAdmin: boolean;
    UserId: string;
  };

  CommentCreatedAt: string;
  CommentBody: string;
  CommentId: number;
  UserId: string;
  ChildComments?: Comment[];
}
