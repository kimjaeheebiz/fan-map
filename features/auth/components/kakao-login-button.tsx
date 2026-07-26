"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type KakaoLoginButtonProps = {
  onClick: () => void;
  loading?: boolean;
  className?: string;
  label?: string;
};

/** 카카오 공식 가이드에 가까운 노란색 로그인 버튼 (Mock) */
export function KakaoLoginButton({
  onClick,
  loading = false,
  className,
  label = "카카오로 시작하기",
}: KakaoLoginButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={cn(
        "flex h-11 w-full items-center justify-center gap-2 rounded-md text-sm font-medium transition-opacity",
        "bg-[#FEE500] text-[#191919] hover:opacity-90",
        "disabled:pointer-events-none disabled:opacity-60",
        className,
      )}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <KakaoSymbol className="size-4" />
      )}
      {label}
    </button>
  );
}

function KakaoSymbol({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M12 3c-5.52 0-10 3.58-10 8 0 2.84 1.87 5.34 4.71 6.78-.15.54-.86 3.12-.89 3.32 0 0-.18.11.01.22.08.05.18.02.18.02.24-.03 2.78-1.83 3.22-2.14A12.3 12.3 0 0 0 12 19c5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
    </svg>
  );
}
