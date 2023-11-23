export interface Comment {
  User: {
    UserName: string;
    UserIsAdmin: boolean;
  };
  CommentCreatedAt: string;
  CommentBody: string;
  CommentId: number;
  UserId: string;
}
