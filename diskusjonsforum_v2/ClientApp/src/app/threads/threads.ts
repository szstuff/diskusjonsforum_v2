import { Comment } from "../comments/comments";
// the structure of thread interface
export interface Thread {
  threadId: number; // a unique id
  threadTitle: string; //holds a string for the title of  thread
  threadBody: string; // holds a string for the body of the thread
  threadCreatedAt: string; // timestamp string for when the thread was created
  threadLastEditedAt: string; // timestamp string for when the thread was last edited
  createdBy: string | null; // the info of the user who created the thread
  threadComments: Comment[] | null; // holds comments in an array if there is any or null if there are none
}
