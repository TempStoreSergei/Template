export interface User {
  id: string;
  userFullname: string;
  userSurname: string;
  userPatronymic: string;
  userEmail: string;
  userPhone: string;
  userRole: "admin" | "user" | "manager";
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface CreateUserRequest {
  userFullname: string;
  userSurname: string;
  userPatronymic: string;
  userEmail: string;
  userPhone: string;
  userRole: "admin" | "user" | "manager";
}

export interface UpdateUserRequest {
  id: string;
  userFullname?: string;
  userSurname?: string;
  userPatronymic?: string;
  userEmail?: string;
  userPhone?: string;
  userRole?: "admin" | "user" | "manager";
  isActive?: boolean;
} 