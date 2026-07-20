"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/common/form-field";

const registerSchema = z
  .object({
    name: z.string().min(2, "이름은 2자 이상이어야 합니다."),
    email: z.email("유효한 이메일을 입력해 주세요."),
    password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다."),
    confirmPassword: z.string().min(6, "비밀번호 확인을 입력해 주세요."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { control, handleSubmit } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(() => {
    toast.success("회원가입 요청이 전송되었습니다. (Mock)");
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">회원가입</h1>
        <p className="text-muted-foreground">
          새 계정을 만들어 시작해 주세요.
        </p>
      </div>

      <FormField control={control} name="name" label="이름" required>
        {(field) => (
          <Input {...field} id="name" placeholder="홍길동" autoComplete="name" />
        )}
      </FormField>

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
            autoComplete="new-password"
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
            placeholder="••••••••"
            autoComplete="new-password"
          />
        )}
      </FormField>

      <Button type="submit" className="w-full">
        계정 만들기
      </Button>

      <p className="text-muted-foreground text-center">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="text-foreground font-medium underline">
          로그인
        </Link>
      </p>
    </form>
  );
}
