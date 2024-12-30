export interface User {
  _id: string;
  username: string;
  email: string;
  profileImage: string;
}

export type UpdateProfileResponse = {
  message: string;
  profileImage: string;
};