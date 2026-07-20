import type { User, UserInput, UserListParams, UserListResult } from "@/features/users/types";

let users: User[] = [
  {
    id: "1",
    name: "김민수",
    email: "minsu.kim@example.com",
    role: "admin",
    status: "active",
    createdAt: "2026-01-12",
  },
  {
    id: "2",
    name: "이서연",
    email: "seoyeon.lee@example.com",
    role: "editor",
    status: "active",
    createdAt: "2026-02-03",
  },
  {
    id: "3",
    name: "박준호",
    email: "junho.park@example.com",
    role: "viewer",
    status: "inactive",
    createdAt: "2026-02-18",
  },
  {
    id: "4",
    name: "최유진",
    email: "yujin.choi@example.com",
    role: "editor",
    status: "active",
    createdAt: "2026-03-01",
  },
  {
    id: "5",
    name: "정하늘",
    email: "haneul.jung@example.com",
    role: "viewer",
    status: "active",
    createdAt: "2026-03-22",
  },
  {
    id: "6",
    name: "한지훈",
    email: "jihoon.han@example.com",
    role: "admin",
    status: "active",
    createdAt: "2026-04-09",
  },
  {
    id: "7",
    name: "오세린",
    email: "serin.oh@example.com",
    role: "editor",
    status: "inactive",
    createdAt: "2026-05-14",
  },
  {
    id: "8",
    name: "윤도현",
    email: "dohyun.yoon@example.com",
    role: "viewer",
    status: "active",
    createdAt: "2026-06-02",
  },
];

function delay(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function listUsers(
  params: UserListParams = {},
): Promise<UserListResult> {
  await delay();
  const q = params.q?.trim().toLowerCase() ?? "";
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 5;

  const filtered = users.filter((user) => {
    if (!q) return true;
    return (
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      user.role.includes(q)
    );
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * pageSize;

  return {
    items: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page: currentPage,
    pageSize,
    pageCount,
  };
}

export async function getUser(id: string): Promise<User | null> {
  await delay();
  return users.find((user) => user.id === id) ?? null;
}

export async function createUser(input: UserInput): Promise<User> {
  await delay();
  const user: User = {
    id: String(Date.now()),
    ...input,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  users = [user, ...users];
  return user;
}

export async function updateUser(id: string, input: UserInput): Promise<User> {
  await delay();
  const index = users.findIndex((user) => user.id === id);
  if (index < 0) {
    throw new Error("User not found");
  }
  const updated: User = { ...users[index], ...input };
  users = [...users.slice(0, index), updated, ...users.slice(index + 1)];
  return updated;
}

export async function deleteUser(id: string): Promise<void> {
  await delay();
  users = users.filter((user) => user.id !== id);
}
