
export interface UserManagementUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  roleName?: string; // Making sure roleName exists
  createdAt: string;
  adminLevel?: number;
}
