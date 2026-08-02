import type {
  AuthProviderId,
  AuthUser,
  KakaoPendingProfile,
  SocialAuthProviderId,
} from "@/features/auth/types";
import { isAuthProviderId } from "@/features/auth/types";
import { clearFavoritePlaces } from "@/features/places/lib/favorites-storage";

const USERS_KEY = "fan-map:users";
const SESSION_KEY = "fan-map:session";
const PENDING_KAKAO_KEY = "fan-map:kakao-pending";
const EMAIL_CREDENTIALS_KEY = "fan-map:email-credentials";
const LAST_PROVIDER_KEY = "fan-map:last-auth-provider";

export const AUTH_CHANGED_EVENT = "fan-map:auth-changed";

type EmailCredential = {
  email: string;
  password: string;
  userId: string;
};

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
    isAuthProviderId(user.provider) &&
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

function readEmailCredentials(): EmailCredential[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(EMAIL_CREDENTIALS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is EmailCredential =>
        !!entry &&
        typeof entry === "object" &&
        typeof (entry as EmailCredential).email === "string" &&
        typeof (entry as EmailCredential).password === "string" &&
        typeof (entry as EmailCredential).userId === "string",
    );
  } catch {
    return [];
  }
}

function writeEmailCredentials(credentials: EmailCredential[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(EMAIL_CREDENTIALS_KEY, JSON.stringify(credentials));
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

export function readLastAuthProvider(): AuthProviderId | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(LAST_PROVIDER_KEY);
  return isAuthProviderId(value) ? value : null;
}

function writeLastAuthProvider(provider: AuthProviderId) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LAST_PROVIDER_KEY, provider);
}

/** 로그인 시각을 갱신한 사용자 객체를 세션·유저 목록에 반영 */
function persistLoggedInUser(user: AuthUser): AuthUser {
  const next: AuthUser = {
    ...user,
    lastLoginAt: new Date().toISOString(),
  };
  upsertUser(next);
  writeLastAuthProvider(next.provider);
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

function randomNickname() {
  return `팬${Math.floor(1000 + Math.random() * 9000)}`;
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

/** 소셜 Mock — 기존 회원이면 로그인, 없으면 자동 가입 */
export function loginWithSocialMock(provider: SocialAuthProviderId): AuthUser {
  const existing = readUsers().find((user) => user.provider === provider);
  if (existing) {
    writeKakaoPending(null);
    return persistLoggedInUser(existing);
  }

  const now = new Date().toISOString();
  const user: AuthUser = {
    id: `${provider}_mock_${Date.now().toString(36)}`,
    nickname: randomNickname(),
    provider,
    createdAt: now,
    lastLoginAt: now,
  };
  writeKakaoPending(null);
  upsertUser(user);
  writeLastAuthProvider(provider);
  writeSessionUser(user);
  return user;
}

/** @deprecated 호환용 — loginWithSocialMock("kakao")와 동일 계열 */
export function startKakaoLoginMock(): {
  status: "logged_in" | "needs_signup";
  user?: AuthUser;
  pending?: KakaoPendingProfile;
} {
  const user = loginWithSocialMock("kakao");
  return { status: "logged_in", user };
}

export function beginKakaoSignupMock(): KakaoPendingProfile {
  const pending: KakaoPendingProfile = {
    kakaoId: `kakao_mock_${Date.now().toString(36)}`,
    suggestedNickname: randomNickname(),
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
  writeLastAuthProvider("kakao");
  writeSessionUser(user);
  return user;
}

export function registerWithEmailMock(input: {
  email: string;
  password: string;
  nickname: string;
}): AuthUser {
  const email = input.email.trim().toLowerCase();
  const nickname = input.nickname.trim();
  const password = input.password;

  if (!email.includes("@")) {
    throw new Error("유효한 이메일을 입력해 주세요.");
  }
  if (password.length < 6) {
    throw new Error("비밀번호는 6자 이상이어야 합니다.");
  }
  if (nickname.length < 2) {
    throw new Error("닉네임은 2자 이상이어야 합니다.");
  }
  if (nickname.length > 20) {
    throw new Error("닉네임은 20자 이하여야 합니다.");
  }

  const credentials = readEmailCredentials();
  if (credentials.some((entry) => entry.email === email)) {
    throw new Error("이미 가입된 이메일입니다.");
  }

  const now = new Date().toISOString();
  const user: AuthUser = {
    id: `email_${Date.now().toString(36)}`,
    nickname,
    email,
    provider: "email",
    createdAt: now,
    lastLoginAt: now,
  };

  upsertUser(user);
  writeEmailCredentials([...credentials, { email, password, userId: user.id }]);
  writeLastAuthProvider("email");
  writeSessionUser(user);
  return user;
}

export function loginWithEmailMock(input: {
  email: string;
  password: string;
}): AuthUser {
  const email = input.email.trim().toLowerCase();
  const credential = readEmailCredentials().find((entry) => entry.email === email);
  if (!credential || credential.password !== input.password) {
    throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
  }

  const user = findUserById(credential.userId);
  if (!user) {
    throw new Error("계정 정보를 찾을 수 없습니다.");
  }

  return persistLoggedInUser(user);
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
  if (current.provider === "email" && current.email) {
    writeEmailCredentials(
      readEmailCredentials().filter((entry) => entry.userId !== current.id),
    );
  }
  clearSession();
}

export function clearSession() {
  writeSessionUser(null);
  writeKakaoPending(null);
}
