"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { AccountPageShell } from "@/features/account/components/account-page-shell";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { PageCard } from "@/components/common/page-card";
import { Button } from "@/components/ui/button";

export default function WithdrawPage() {
  const router = useRouter();
  const { deleteAccount } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleConfirm() {
    setLoading(true);
    try {
      deleteAccount();
      toast.success("회원 탈퇴가 완료되었습니다. (Mock)");
      setOpen(false);
      router.replace("/");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "탈퇴에 실패했습니다.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AccountPageShell
      title="회원 탈퇴"
      description="계정을 삭제하면 이 기기의 로그인·프로필 Mock 데이터가 제거됩니다."
    >
      <PageCard className="bg-muted/40 shadow-none">
        <div className="space-y-2 text-sm">
          <p className="font-medium">탈퇴 전 확인해 주세요</p>
          <ul className="text-muted-foreground list-disc space-y-1 pl-4 text-xs">
            <li>해당 계정의 즐겨찾기는 함께 삭제됩니다.</li>
            <li>
              남긴 방문 경험의 작성자 연결은 아직 서버에 저장되지 않습니다.
            </li>
            <li>실제 카카오 연결 해제는 Mock 단계에서 수행되지 않습니다.</li>
          </ul>
        </div>
      </PageCard>

      <Button
        type="button"
        variant="destructive"
        className="w-full"
        onClick={() => setOpen(true)}
      >
        회원 탈퇴하기
      </Button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="정말 탈퇴할까요?"
        description="이 작업은 되돌릴 수 없습니다. (Mock)"
        confirmLabel="탈퇴"
        variant="destructive"
        loading={loading}
        onConfirm={handleConfirm}
      />
    </AccountPageShell>
  );
}
