export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: any;
  status: string;
  assignee: { _id: string; username: string; email: string };
}

export interface CreateTask {
  title: string;
  description: string;
  dueDate: string;
  status: string;
  assignee: string;
}

export interface UpdateTask {
  title?: string;
  description?: string;
  dueDate?: string;
  status?: string;
  assignee?: string;
}

export interface GetTask {
  title: string;
  tasks: Task[];
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  dueDate: string;
  status: string;
  assignee: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  dueDate?: string;
  status?: 'to-do' | 'in-progress' | 'done';
  assignee?: string;
}

export interface TaskStatsResponse {
  totalTasks: number;
  completedTasks: number;
}

export interface TaskCompletionStatsResponse {
  _id: {
    date: string;
    status: string;
  };
  count: number;
}
