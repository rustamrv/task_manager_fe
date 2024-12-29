export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: any;
  status: string;
  assignee: { _id: string; username: string; email: string };
}
