import { useSyncExternalStore } from "react";

const GUEST_LIKER_KEY = "fan-map:liker-guest-id";

function readGuestLikerId() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(GUEST_LIKER_KEY) ?? "";
}

function getOrCreateGuestLikerId() {
  const existing = readGuestLikerId();
  if (existing) return existing;
  if (typeof window === "undefined") return "";
  const next = `guest-${crypto.randomUUID()}`;
  localStorage.setItem(GUEST_LIKER_KEY, next);
  return next;
}

/** 로그인 사용자 id 또는 게스트 id (없으면 생성) */
export function resolveLikerId(userId?: string | null) {
  if (userId) return userId;
  return getOrCreateGuestLikerId();
}

const subscribeGuestLiker = () => () => {};

/** 렌더용 — 저장된 게스트 id만 읽음. 생성은 resolveLikerId */
export function useLikerId(userId?: string | null) {
  const guestId = useSyncExternalStore(
    subscribeGuestLiker,
    readGuestLikerId,
    () => "",
  );
  return userId || guestId;
}
