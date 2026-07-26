"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { authNav } from "@/config/navigation";
import { FormField } from "@/components/common/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const signupSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(2, "닉네임은 2자 이상이어야 합니다.")
    .max(20, "닉네임은 20자 이하여야 합니다."),
});

type SignupValues = z.infer<typeof signupSchema>;

function safeReturnUrl(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

function KakaoSignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = safeReturnUrl(searchParams.get("returnUrl"));
  const {
    pendingKakao,
    prepareKakaoSignup,
    completeKakaoSignup,
    isAuthenticated,
  } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, reset } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { nickname: "" },
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(returnUrl);
      return;
    }
    if (pendingKakao) {
      reset({ nickname: pendingKakao.suggestedNickname });
      return;
    }
    const pending = prepareKakaoSignup();
    reset({ nickname: pending.suggestedNickname });
  }, [
    isAuthenticated,
    pendingKakao,
    prepareKakaoSignup,
    reset,
    returnUrl,
    router,
  ]);

  const onSubmit = handleSubmit((values) => {
    setSubmitting(true);
    try {
      completeKakaoSignup(values.nickname);
      toast.success("가입이 완료되었습니다. (Mock)");
      router.replace(returnUrl);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "가입에 실패했습니다.",
      );
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">빠른 가입</h1>
        <p className="text-muted-foreground">
          카카오에서 가져온 닉네임을 확인하고 시작해 주세요.
        </p>
      </div>

      <div className="bg-muted/50 rounded-lg px-3 py-2 text-xs">
        <p className="text-muted-foreground">연동 계정</p>
        <p className="font-medium">카카오 (Mock)</p>
      </div>

      <FormField control={control} name="nickname" label="닉네임" required>
        {(field) => (
          <Input
            {...field}
            id="nickname"
            placeholder="닉네임"
            autoComplete="nickname"
            maxLength={20}
          />
        )}
      </FormField>

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "가입 중..." : "시작하기"}
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        <Link
          href={`${authNav.login}?returnUrl=${encodeURIComponent(returnUrl)}`}
          className="text-foreground font-medium underline"
        >
          로그인으로 돌아가기
        </Link>
      </p>
    </form>
  );
}

export default function KakaoSignupPage() {
  return (
    <Suspense fallback={<Skeleton className="h-48 w-full" />}>
      <KakaoSignupForm />
    </Suspense>
  );
}
