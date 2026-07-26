"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { authNav } from "@/config/navigation";
import { AccountPageShell } from "@/features/account/components/account-page-shell";
import { FormField } from "@/components/common/form-field";
import { PageCard } from "@/components/common/page-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDateTime } from "@/lib/format-date";

const profileSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(2, "닉네임은 2자 이상이어야 합니다.")
    .max(20, "닉네임은 20자 이하여야 합니다."),
});

type ProfileValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [saving, setSaving] = useState(false);

  const { control, handleSubmit } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    values: { nickname: user?.nickname ?? "" },
  });

  const onSubmit = handleSubmit((values) => {
    setSaving(true);
    try {
      updateProfile({ nickname: values.nickname });
      toast.success("프로필을 저장했습니다.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "저장에 실패했습니다.",
      );
    } finally {
      setSaving(false);
    }
  });

  return (
    <AccountPageShell
      title="내 정보 관리"
      description="닉네임과 연동 계정 정보를 확인합니다."
    >
      <PageCard>
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <div className="bg-muted/40 space-y-2 rounded-lg px-3 py-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">로그인 방식</span>
              <Badge variant="secondary">카카오</Badge>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">회원 ID</span>
              <span className="truncate font-mono text-xs">{user?.id}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">가입일</span>
              <span>
                {user ? formatDateTime(user.createdAt) : "-"}
              </span>
            </div>
          </div>

          <FormField control={control} name="nickname" label="닉네임" required>
            {(field) => (
              <Input
                {...field}
                id="nickname"
                maxLength={20}
                autoComplete="nickname"
              />
            )}
          </FormField>

          <Button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto sm:self-end"
          >
            {saving ? "저장 중..." : "저장"}
          </Button>
        </form>
      </PageCard>

      <p className="mt-10 text-center">
        <Link
          href={authNav.withdraw}
          className="text-muted-foreground/70 text-xs underline-offset-2 hover:underline"
        >
          회원 탈퇴
        </Link>
      </p>
    </AccountPageShell>
  );
}
