export type AuthProviderId = "email" | "kakao" | "naver" | "google";

export const AUTH_PROVIDER_IDS: AuthProviderId[] = [
  "email",
  "kakao",
  "naver",
  "google",
];

export const authProviderLabels: Record<AuthProviderId, string> = {
  email: "이메일",
  kakao: "카카오",
  naver: "네이버",
  google: "Google",
};

export type SocialAuthProviderId = Exclude<AuthProviderId, "email">;

export const SOCIAL_AUTH_PROVIDERS: SocialAuthProviderId[] = [
  "kakao",
  "naver",
  "google",
];

export type AuthUser = {
  id: string;
  nickname: string;
  provider: AuthProviderId;
  email?: string;
  avatarUrl?: string;
  createdAt: string;
  lastLoginAt?: string; // ISO — 마지막 로그인 시각
};

/** @deprecated 카카오 전용 가입 화면 호환용 */
export type KakaoPendingProfile = {
  kakaoId: string;
  suggestedNickname: string;
};

export function isAuthProviderId(value: unknown): value is AuthProviderId {
  return (
    typeof value === "string" &&
    (AUTH_PROVIDER_IDS as string[]).includes(value)
  );
}
