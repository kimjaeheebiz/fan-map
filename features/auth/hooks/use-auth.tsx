"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AuthProviderId,
  AuthUser,
  KakaoPendingProfile,
  SocialAuthProviderId,
} from "@/features/auth/types";
import {
  AUTH_CHANGED_EVENT,
  beginKakaoSignupMock,
  clearSession,
  completeKakaoSignup as completeKakaoSignupStorage,
  deleteAccount as deleteAccountStorage,
  loginWithEmailMock,
  loginWithSocialMock,
  readKakaoPending,
  readLastAuthProvider,
  readSessionUser,
  registerWithEmailMock,
  startKakaoLoginMock,
  updateProfile as updateProfileStorage,
} from "@/features/auth/lib/auth-storage";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isReady: boolean;
  pendingKakao: KakaoPendingProfile | null;
  lastAuthProvider: AuthProviderId | null;
  loginWithSocialMock: (provider: SocialAuthProviderId) => AuthUser;
  loginWithEmailMock: (input: {
    email: string;
    password: string;
  }) => AuthUser;
  registerWithEmailMock: (input: {
    email: string;
    password: string;
    nickname: string;
  }) => AuthUser;
  /** @deprecated loginWithSocialMock("kakao") 사용 */
  loginWithKakaoMock: () => { status: "logged_in" | "needs_signup" };
  prepareKakaoSignup: () => KakaoPendingProfile;
  completeKakaoSignup: (nickname: string) => AuthUser;
  updateProfile: (patch: { nickname: string }) => AuthUser;
  deleteAccount: () => void;
  logout: () => void;
  refresh: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [pendingKakao, setPendingKakao] = useState<KakaoPendingProfile | null>(
    null,
  );
  const [lastAuthProvider, setLastAuthProvider] =
    useState<AuthProviderId | null>(null);
  const [isReady, setIsReady] = useState(false);

  const refresh = useCallback(() => {
    setUser(readSessionUser());
    setPendingKakao(readKakaoPending());
    setLastAuthProvider(readLastAuthProvider());
    setIsReady(true);
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      refresh();
    });

    function onChange() {
      refresh();
    }

    window.addEventListener("storage", onChange);
    window.addEventListener(AUTH_CHANGED_EVENT, onChange);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("storage", onChange);
      window.removeEventListener(AUTH_CHANGED_EVENT, onChange);
    };
  }, [refresh]);

  const loginSocial = useCallback(
    (provider: SocialAuthProviderId) => {
      const next = loginWithSocialMock(provider);
      refresh();
      return next;
    },
    [refresh],
  );

  const loginEmail = useCallback(
    (input: { email: string; password: string }) => {
      const next = loginWithEmailMock(input);
      refresh();
      return next;
    },
    [refresh],
  );

  const registerEmail = useCallback(
    (input: { email: string; password: string; nickname: string }) => {
      const next = registerWithEmailMock(input);
      refresh();
      return next;
    },
    [refresh],
  );

  const loginWithKakaoMock = useCallback(() => {
    const result = startKakaoLoginMock();
    refresh();
    return { status: result.status };
  }, [refresh]);

  const prepareKakaoSignup = useCallback(() => {
    const pending = beginKakaoSignupMock();
    setPendingKakao(pending);
    return pending;
  }, []);

  const completeKakaoSignup = useCallback(
    (nickname: string) => {
      const next = completeKakaoSignupStorage(nickname);
      refresh();
      return next;
    },
    [refresh],
  );

  const updateProfile = useCallback(
    (patch: { nickname: string }) => {
      const next = updateProfileStorage(patch);
      refresh();
      return next;
    },
    [refresh],
  );

  const deleteAccount = useCallback(() => {
    deleteAccountStorage();
    refresh();
  }, [refresh]);

  const logout = useCallback(() => {
    clearSession();
    refresh();
  }, [refresh]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user != null,
      isReady,
      pendingKakao,
      lastAuthProvider,
      loginWithSocialMock: loginSocial,
      loginWithEmailMock: loginEmail,
      registerWithEmailMock: registerEmail,
      loginWithKakaoMock,
      prepareKakaoSignup,
      completeKakaoSignup,
      updateProfile,
      deleteAccount,
      logout,
      refresh,
    }),
    [
      user,
      isReady,
      pendingKakao,
      lastAuthProvider,
      loginSocial,
      loginEmail,
      registerEmail,
      loginWithKakaoMock,
      prepareKakaoSignup,
      completeKakaoSignup,
      updateProfile,
      deleteAccount,
      logout,
      refresh,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 AuthProvider 안에서만 사용할 수 있습니다.");
  }
  return context;
}
