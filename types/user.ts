export enum UserRole {
  ADMIN = 'ADMIN',
  SALES = 'SALES',
}

export interface UserWithRole {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}