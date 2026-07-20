"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/common/form-field";

const loginSchema = z.object({
  email: z.email("유효한 이메일을 입력해 주세요."),
  password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다."),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { control, handleSubmit } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(() => {
    toast.success("로그인 요청이 전송되었습니다. (Mock)");
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">로그인</h1>
        <p className="text-muted-foreground">
          이메일과 비밀번호로 로그인해 주세요.
        </p>
      </div>

      <FormField control={control} name="email" label="이메일" required>
        {(field) => (
          <Input
            {...field}
            id="email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
          />
        )}
      </FormField>

      <FormField control={control} name="password" label="비밀번호" required>
        {(field) => (
          <Input
            {...field}
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
          />
        )}
      </FormField>

      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-muted-foreground hover:text-foreground"
        >
          비밀번호를 잊으셨나요?
        </Link>
      </div>

      <Button type="submit" className="w-full">
        로그인
      </Button>

      <p className="text-muted-foreground text-center">
        아직 계정이 없으신가요?{" "}
        <Link href="/register" className="text-foreground font-medium underline">
          회원가입
        </Link>
      </p>
    </form>
  );
}
