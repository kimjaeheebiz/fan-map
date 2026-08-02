"use client";

import { cn } from "@/lib/utils";
import type { SocialAuthProviderId } from "@/features/auth/types";
import { authProviderLabels } from "@/features/auth/types";

type SocialLoginButtonsProps = {
  onSelect: (provider: SocialAuthProviderId) => void;
  disabled?: boolean;
  recentProvider?: SocialAuthProviderId | null;
  className?: string;
};

/** 국내 앱 관행: 카카오 → 네이버 → Google */
const socialOrder: SocialAuthProviderId[] = ["kakao", "naver", "google"];

/** 간편 로그인 full-width 브랜드 버튼 */
export function SocialLoginButtons({
  onSelect,
  disabled = false,
  recentProvider = null,
  className,
}: SocialLoginButtonsProps) {
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      {socialOrder.map((provider) => {
        const recent = recentProvider === provider;
        return (
          <button
            key={provider}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(provider)}
            className={cn(
              "relative inline-flex h-11 w-full items-center justify-center gap-2 rounded-md text-sm font-medium transition-opacity",
              "disabled:pointer-events-none disabled:opacity-50",
              "hover:opacity-90 focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
              providerSurfaceClass(provider),
            )}
          >
            <SocialGlyph provider={provider} />
            <span>{authProviderLabels[provider]}로 계속하기</span>
            {recent ? (
              <span className="bg-foreground text-background absolute top-1/2 right-2.5 -translate-y-1/2 rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-none">
                최근
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function providerSurfaceClass(provider: SocialAuthProviderId) {
  switch (provider) {
    case "kakao":
      return "bg-[#FEE500] text-[#191919]";
    case "naver":
      return "bg-[#03C75A] text-white";
    case "google":
      return "border-border bg-background text-foreground border";
  }
}

function SocialGlyph({ provider }: { provider: SocialAuthProviderId }) {
  if (provider === "naver") {
    return (
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
        <path
          fill="currentColor"
          d="M7.2 5.5h3.2l3.55 5.8V5.5H17.8v13h-3.2l-3.55-5.8v5.8H7.2z"
        />
      </svg>
    );
  }

  if (provider === "kakao") {
    return (
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
        <path
          fill="currentColor"
          d="M12 4.5c-4.42 0-8 2.8-8 6.25 0 2.2 1.45 4.14 3.65 5.27-.12.44-.7 2.5-.73 2.68 0 0-.14.09.01.18.06.04.14.02.14.02.2-.03 2.28-1.5 2.64-1.75.72.14 1.48.22 2.29.22 4.42 0 8-2.8 8-6.25S16.42 4.5 12 4.5z"
        />
      </svg>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/gmail.png"
      alt="Gmail"
      width={20}
      height={20}
      className="size-4 object-contain"
      aria-hidden
    />
  );
}
