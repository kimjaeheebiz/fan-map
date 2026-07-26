export type AuthProviderId = "kakao";

export type AuthUser = {
  id: string;
  nickname: string;
  provider: AuthProviderId;
  avatarUrl?: string;
  createdAt: string;
  /** ISO — 마지막 로그인 시각 */
  lastLoginAt?: string;
};

/** 카카오 Mock 동의 직후, 빠른 가입 전 임시 프로필 */
export type KakaoPendingProfile = {
  kakaoId: string;
  suggestedNickname: string;
};
