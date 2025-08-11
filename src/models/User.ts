export interface User {
  id: number;
  email: string;
}
export interface ProfileResponse {
  message: string;
  user: User;
}
