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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/common/form-field";
import { Skeleton } from "@/components/ui/skeleton";

const registerSchema = z
  .object({
    nickname: z
      .string()
      .min(2, "닉네임은 2자 이상이어야 합니다.")
      .max(20, "닉네임은 20자 이하여야 합니다."),
    email: z.email("유효한 이메일을 입력해 주세요."),
    password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다."),
    confirmPassword: z.string().min(6, "비밀번호 확인을 입력해 주세요."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

function safeReturnUrl(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = safeReturnUrl(searchParams.get("returnUrl"));
  const { registerWithEmailMock, isAuthenticated, isReady } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nickname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace(returnUrl);
    }
  }, [isReady, isAuthenticated, returnUrl, router]);

  const onSubmit = handleSubmit((values) => {
    setSubmitting(true);
    try {
      registerWithEmailMock({
        email: values.email,
        password: values.password,
        nickname: values.nickname,
      });
      toast.success("가입이 완료되었습니다.");
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
        <h1 className="text-xl font-semibold">회원가입</h1>
        <p className="text-muted-foreground">
          이메일로 새 계정을 만들어 주세요.
        </p>
      </div>

      <FormField control={control} name="nickname" label="닉네임" required>
        {(field) => (
          <Input
            {...field}
            id="nickname"
            placeholder="팬맵러"
            autoComplete="nickname"
            disabled={submitting}
          />
        )}
      </FormField>

      <FormField control={control} name="email" label="이메일" required>
        {(field) => (
          <Input
            {...field}
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            disabled={submitting}
          />
        )}
      </FormField>

      <FormField control={control} name="password" label="비밀번호" required>
        {(field) => (
          <Input
            {...field}
            id="password"
            type="password"
            placeholder="6자 이상"
            autoComplete="new-password"
            disabled={submitting}
          />
        )}
      </FormField>

      <FormField
        control={control}
        name="confirmPassword"
        label="비밀번호 확인"
        required
      >
        {(field) => (
          <Input
            {...field}
            id="confirmPassword"
            type="password"
            placeholder="비밀번호 다시 입력"
            autoComplete="new-password"
            disabled={submitting}
          />
        )}
      </FormField>

      <Button type="submit" className="w-full" disabled={submitting}>
        계정 만들기
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        이미 계정이 있으신가요?{" "}
        <Link
          href={`${authNav.login}?returnUrl=${encodeURIComponent(returnUrl)}`}
          className="text-primary font-medium underline underline-offset-4"
        >
          로그인
        </Link>
      </p>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<Skeleton className="h-80 w-full" />}>
      <RegisterForm />
    </Suspense>
  );
}
