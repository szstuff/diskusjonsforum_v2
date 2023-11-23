export interface TThread {
  User: {
    UserName: string;
    UserIsAdmin: boolean;
  };
  ThreadComments: string[];
  ThreadBody: string;
  ThreadTitle: string;
  ThreadId: number;
}
