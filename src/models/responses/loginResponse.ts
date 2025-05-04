export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  userName: string;
  email: string;
  firstName: string;
  secondName: string;
  patronymic: string | null;
  roles: string[];
  permissions: string[];
}
