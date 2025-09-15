export interface AuthenticationResponse {
  userId: string;
  username: string;
  email: string;
  token: string;
  refreshToken: string;
}