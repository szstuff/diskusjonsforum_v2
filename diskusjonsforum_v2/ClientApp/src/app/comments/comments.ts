import { Thread } from "../threads/threads";
//the structure of comment interface
export interface Comment {
  commentId: number; //represents unique id
  commentBody: string; // holds text
  commentCreatedAt: Date; //represents timestamp when the comment was create
  commentLastEditedAt: Date; //represents when the comment was last edited
  threadId: number; //represents unique id for the thread
  thread: Thread | null; //if the comment is not associated with any thread it can be null
  parentCommentId: number | null; //represents the id of the parent comment
  parentComment: Comment | null; // represent/references to the comment of the parent
  createdBy: string | null; // the info of the user who created the comment
  childComments: Comment[]; //if there are replies to the comment the array of child represents it

  isEditing?: boolean;
  editedBody?: string;
}
