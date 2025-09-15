export interface AuthenticationResponse {
  userId: string;
  username: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}