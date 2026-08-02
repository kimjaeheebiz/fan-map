"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { SocialLoginButtons } from "@/features/auth/components/social-login-buttons";
import { useAuth } from "@/features/auth/hooks/use-auth";
import type { SocialAuthProviderId } from "@/features/auth/types";
import { authNav } from "@/config/navigation";
import { FormField } from "@/components/common/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const loginSchema = z.object({
  email: z.email("유효한 이메일을 입력해 주세요."),
  password: z.string().min(1, "비밀번호를 입력해 주세요."),
});

type LoginValues = z.infer<typeof loginSchema>;

function safeReturnUrl(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = safeReturnUrl(searchParams.get("returnUrl"));
  const {
    loginWithSocialMock,
    loginWithEmailMock,
    lastAuthProvider,
    isAuthenticated,
    isReady,
  } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace(returnUrl);
    }
  }, [isReady, isAuthenticated, returnUrl, router]);

  const onSubmit = handleSubmit((values) => {
    setLoading(true);
    try {
      loginWithEmailMock(values);
      router.replace(returnUrl);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "로그인에 실패했습니다.",
      );
    } finally {
      setLoading(false);
    }
  });

  function handleSocial(provider: SocialAuthProviderId) {
    setLoading(true);
    try {
      loginWithSocialMock(provider);
      router.replace(returnUrl);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "로그인에 실패했습니다.",
      );
    } finally {
      setLoading(false);
    }
  }

  const recentSocial =
    lastAuthProvider && lastAuthProvider !== "email"
      ? lastAuthProvider
      : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">로그인</h1>
        <p className="text-muted-foreground text-sm">
          간편 로그인으로 빠르게 시작하세요.
        </p>
      </div>

      <SocialLoginButtons
        onSelect={handleSocial}
        disabled={loading}
        recentProvider={recentSocial}
      />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="border-border w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card text-muted-foreground px-2">
            또는 이메일로
          </span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <FormField control={control} name="email" label="이메일" required>
          {(field) => (
            <Input
              {...field}
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              disabled={loading}
            />
          )}
        </FormField>

        <FormField control={control} name="password" label="비밀번호" required>
          {(field) => (
            <div className="relative">
              <Input
                {...field}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호"
                autoComplete="current-password"
                disabled={loading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute top-1/2 right-1 -translate-y-1/2"
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </Button>
            </div>
          )}
        </FormField>

        <Button type="submit" variant="outline" className="w-full" disabled={loading}>
          이메일로 로그인
        </Button>
      </form>

      <p className="text-muted-foreground text-center text-sm">
        아직 계정이 없나요?{" "}
        <Link
          href={`${authNav.register}?returnUrl=${encodeURIComponent(returnUrl)}`}
          className="text-primary font-medium underline underline-offset-4"
        >
          이메일로 회원가입
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Skeleton className="h-72 w-full" />}>
      <LoginForm />
    </Suspense>
  );
}
