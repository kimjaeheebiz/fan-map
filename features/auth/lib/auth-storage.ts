import type { AuthUser, KakaoPendingProfile } from "@/features/auth/types";
import { clearFavoritePlaces } from "@/features/places/lib/favorites-storage";

const USERS_KEY = "fan-map:users";
const SESSION_KEY = "fan-map:session";
const PENDING_KAKAO_KEY = "fan-map:kakao-pending";

export const AUTH_CHANGED_EVENT = "fan-map:auth-changed";

function notifyAuthChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

function isAuthUser(value: unknown): value is AuthUser {
  if (!value || typeof value !== "object") return false;
  const user = value as AuthUser;
  return (
    typeof user.id === "string" &&
    typeof user.nickname === "string" &&
    user.provider === "kakao" &&
    typeof user.createdAt === "string"
  );
}

export function readUsers(): AuthUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isAuthUser);
  } catch {
    return [];
  }
}

function writeUsers(users: AuthUser[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function readSessionUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return isAuthUser(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeSessionUser(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
  notifyAuthChanged();
}

/** 로그인 시각을 갱신한 사용자 객체를 세션·유저 목록에 반영 */
function persistLoggedInUser(user: AuthUser): AuthUser {
  const next: AuthUser = {
    ...user,
    lastLoginAt: new Date().toISOString(),
  };
  upsertUser(next);
  writeSessionUser(next);
  return next;
}

export function findUserById(id: string) {
  return readUsers().find((user) => user.id === id) ?? null;
}

export function upsertUser(user: AuthUser) {
  const users = readUsers();
  const index = users.findIndex((entry) => entry.id === user.id);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.unshift(user);
  }
  writeUsers(users);
}

export function readKakaoPending(): KakaoPendingProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PENDING_KAKAO_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as KakaoPendingProfile;
    if (
      typeof parsed?.kakaoId === "string" &&
      typeof parsed?.suggestedNickname === "string"
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function writeKakaoPending(profile: KakaoPendingProfile | null) {
  if (typeof window === "undefined") return;
  if (profile) {
    sessionStorage.setItem(PENDING_KAKAO_KEY, JSON.stringify(profile));
  } else {
    sessionStorage.removeItem(PENDING_KAKAO_KEY);
  }
}

/** Mock 카카오 동의 — 기존 회원이면 세션, 아니면 pending 프로필 반환 */
export function startKakaoLoginMock(): {
  status: "logged_in" | "needs_signup";
  user?: AuthUser;
  pending?: KakaoPendingProfile;
} {
  const kakaoId = `kakao_mock_${Date.now().toString(36)}`;
  const suggestedNickname = `팬${Math.floor(1000 + Math.random() * 9000)}`;

  // 데모용: 이미 세션에 있던 카카오 유저가 있으면 재로그인으로 처리하지 않고
  // 항상 “새 동의”처럼 pending을 만들되, users에 동일 nickname 재사용은 signup에서 처리.
  // UI 확인을 위해: users 중 가장 최근 카카오 유저가 있으면 바로 로그인 옵션도 제공.
  // 계획: "이미 가입된 Mock 유저면 바로 로그인"
  const existing = readUsers().find((user) => user.provider === "kakao");
  if (existing) {
    writeKakaoPending(null);
    const user = persistLoggedInUser(existing);
    return { status: "logged_in", user };
  }

  const pending: KakaoPendingProfile = { kakaoId, suggestedNickname };
  writeKakaoPending(pending);
  return { status: "needs_signup", pending };
}

/** 강제 신규 가입 플로우 (빠른 가입 화면 진입용) */
export function beginKakaoSignupMock(): KakaoPendingProfile {
  const pending: KakaoPendingProfile = {
    kakaoId: `kakao_mock_${Date.now().toString(36)}`,
    suggestedNickname: `팬${Math.floor(1000 + Math.random() * 9000)}`,
  };
  writeKakaoPending(pending);
  return pending;
}

export function completeKakaoSignup(nickname: string): AuthUser {
  const trimmed = nickname.trim();
  if (trimmed.length < 2) {
    throw new Error("닉네임은 2자 이상이어야 합니다.");
  }

  const pending = readKakaoPending();
  const id = pending?.kakaoId ?? `kakao_mock_${Date.now().toString(36)}`;

  const now = new Date().toISOString();
  const user: AuthUser = {
    id,
    nickname: trimmed,
    provider: "kakao",
    createdAt: now,
    lastLoginAt: now,
  };

  upsertUser(user);
  writeKakaoPending(null);
  writeSessionUser(user);
  return user;
}

export function updateProfile(patch: { nickname: string }): AuthUser {
  const current = readSessionUser();
  if (!current) {
    throw new Error("로그인이 필요합니다.");
  }
  const nickname = patch.nickname.trim();
  if (nickname.length < 2) {
    throw new Error("닉네임은 2자 이상이어야 합니다.");
  }
  if (nickname.length > 20) {
    throw new Error("닉네임은 20자 이하여야 합니다.");
  }

  const next: AuthUser = { ...current, nickname };
  upsertUser(next);
  writeSessionUser(next);
  return next;
}

/** Mock 회원 탈퇴 — 현재 유저 삭제 후 세션 종료 */
export function deleteAccount(): void {
  const current = readSessionUser();
  if (!current) {
    throw new Error("로그인이 필요합니다.");
  }
  clearFavoritePlaces(current.id);
  writeUsers(readUsers().filter((user) => user.id !== current.id));
  clearSession();
}

export function clearSession() {
  writeSessionUser(null);
  writeKakaoPending(null);
}
