"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/common/form-field";

const forgotSchema = z.object({
  email: z.email("유효한 이메일을 입력해 주세요."),
});

type ForgotValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const { control, handleSubmit } = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit(() => {
    toast.success("비밀번호 재설정 링크를 보냈습니다. (Mock)");
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">비밀번호 찾기</h1>
        <p className="text-muted-foreground">
          가입한 이메일로 재설정 링크를 보내드립니다.
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

      <Button type="submit" className="w-full">
        재설정 링크 보내기
      </Button>

      <p className="text-muted-foreground text-center">
        <Link href="/login" className="text-foreground font-medium underline">
          로그인으로 돌아가기
        </Link>
      </p>
    </form>
  );
}
