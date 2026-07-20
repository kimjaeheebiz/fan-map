export type UserRole = "admin" | "editor" | "viewer";
export type UserStatus = "active" | "inactive";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
};

export type UserInput = {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
};

export type UserListParams = {
  q?: string;
  page?: number;
  pageSize?: number;
};

export type UserListResult = {
  items: User[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};
