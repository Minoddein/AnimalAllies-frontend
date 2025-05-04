export interface User {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  secondName: string;
  patronymic: string | null | undefined;
  roles: string[];
  permissions: string[];
}
