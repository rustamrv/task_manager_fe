export type RegisterUserRequest = {
  username: string;
  password: string;
  email: string;
};

export type LoginUserRequest = {
  email: string;
  password: string;
};

export type RegisterUserResponse = {
  id: string;
  username: string;
  email: string;
  token: string;
};

export type LoginUserResponse = {
  token: string;
};
