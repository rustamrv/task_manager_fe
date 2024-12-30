export interface RegisterUserRequest {
  username: string;
  password: string;
  email: string;
}

export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface RegisterUserResponse {
  id: string;
  username: string;
  email: string;
  token: string;
}

export interface LoginUserResponse {
  token: string;
}
