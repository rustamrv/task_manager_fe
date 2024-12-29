export interface RegisterUserRequest {
  username: string;
  password: string;
  email: string;
}

export interface LoginUserRequest {
  email: string;
  password: string;
}
