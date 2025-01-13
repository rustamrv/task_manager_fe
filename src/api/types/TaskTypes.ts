export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  assignee: { _id: string; username: string; email: string };
};

export type CreateTask = {
  title: string;
  description: string;
  dueDate: string;
  status: string;
  assignee: string;
};

export type UpdateTask = {
  title?: string;
  description?: string;
  dueDate?: string;
  status?: string;
  assignee?: string;
};

export type GetTask = {
  [key: string]: Task[];
};

export type CreateTaskRequest = {
  title: string;
  description: string;
  dueDate: string;
  status: string;
  assignee: string;
};

export type UpdateTaskRequest = {
  title?: string;
  description?: string;
  dueDate?: string;
  status?: 'to-do' | 'in-progress' | 'done';
  assignee?: string;
};

export type TaskStatsResponse = {
  totalTasks: number;
  completedTasks: number;
};

export type TaskCompletionStatsResponse = {
  _id: {
    date: string;
    status: string;
  };
  count: number;
};

export type DraggedTask = Task & {
  index: number;
};
