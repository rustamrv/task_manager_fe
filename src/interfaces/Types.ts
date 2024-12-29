export interface CreateTaskError {
  data?: {
    errors?: { msg: string }[];
  };
}

export interface BackendError {
  data?: {
    message?: string;
    error?: string;
  };
}
