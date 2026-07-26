"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { KakaoLoginButton } from "@/features/auth/components/kakao-login-button";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { authNav } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function safeReturnUrl(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = safeReturnUrl(searchParams.get("returnUrl"));
  const { loginWithKakaoMock, prepareKakaoSignup, isAuthenticated, isReady } =
    useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace(returnUrl);
    }
  }, [isReady, isAuthenticated, returnUrl, router]);

  function handleKakaoLogin() {
    setLoading(true);
    try {
      const result = loginWithKakaoMock();
      if (result.status === "logged_in") {
        toast.success("카카오 로그인되었습니다. (Mock)");
        router.replace(returnUrl);
        return;
      }

      toast.message("카카오 동의 완료 — 닉네임을 확인해 주세요. (Mock)");
      const params = new URLSearchParams({ returnUrl });
      router.push(`${authNav.signupKakao}?${params.toString()}`);
    } finally {
      setLoading(false);
    }
  }

  function handleForceSignup() {
    prepareKakaoSignup();
    const params = new URLSearchParams({ returnUrl });
    router.push(`${authNav.signupKakao}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">로그인</h1>
        <p className="text-muted-foreground">
          카카오 계정으로 빠르게 시작할 수 있어요.
        </p>
      </div>

      <KakaoLoginButton onClick={handleKakaoLogin} loading={loading} />

      <p className="text-muted-foreground text-center text-xs leading-relaxed">
        UI 확인용 Mock입니다. 실제 카카오 OAuth는 연동되지 않습니다.
      </p>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="border-border w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card text-muted-foreground px-2">또는</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleForceSignup}
      >
        새 계정으로 빠른 가입 체험
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        <Link href="/" className="text-foreground font-medium underline">
          지도로 돌아가기
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Skeleton className="h-48 w-full" />}>
      <LoginForm />
    </Suspense>
  );
}
