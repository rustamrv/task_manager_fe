export interface TaskError {
  data?: {
    errors?: { field: string; msg: string }[];
  };
}

export interface BackendError {
  data?: {
    message?: string;
    error?: string;
  };
}
