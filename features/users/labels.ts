import type { UserRole, UserStatus } from "@/features/users/types";

export const userRoleLabel: Record<UserRole, string> = {
  admin: "관리자",
  editor: "편집자",
  viewer: "뷰어",
};

export const userStatusLabel: Record<UserStatus, string> = {
  active: "활성",
  inactive: "비활성",
};

export const userStatusBadgeVariant: Record<
  UserStatus,
  "success" | "wait"
> = {
  active: "success",
  inactive: "wait",
};

export const userRoleItems = (
  Object.entries(userRoleLabel) as [UserRole, string][]
).map(([value, label]) => ({ value, label }));

export const userStatusItems = (
  Object.entries(userStatusLabel) as [UserStatus, string][]
).map(([value, label]) => ({ value, label }));
