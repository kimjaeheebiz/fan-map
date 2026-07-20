"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ConfirmDialog,
  Loading,
  PageCard,
  PageMetaHeader,
} from "@/components/common";
import { useDeleteUser, useUser } from "@/features/users/hooks/use-users";
import {
  userRoleLabel,
  userStatusBadgeVariant,
  userStatusLabel,
} from "@/features/users/labels";
import { getPageMeta, getUserDetailPageMeta } from "@/config/pages";
import { useState } from "react";

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: user, isLoading } = useUser(params.id);
  const deleteUser = useDeleteUser();
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <>
        <PageMetaHeader meta={getPageMeta("usersNotFound")} />
        <PageCard>
          <Button render={<Link href="/users" />} nativeButton={false}>
            목록으로
          </Button>
        </PageCard>
      </>
    );
  }

  return (
    <>
      <PageMetaHeader
        meta={getUserDetailPageMeta(user)}
        actions={
          <>
            <Button
              variant="outline"
              render={<Link href={`/users/${user.id}/edit`} />}
              nativeButton={false}
            >
              수정
            </Button>
            <Button variant="destructive" onClick={() => setOpen(true)}>
              삭제
            </Button>
          </>
        }
      />

      <PageCard className="max-w-xl">
        <div className="grid gap-4">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">역할</span>
            <Badge variant="secondary">{userRoleLabel[user.role]}</Badge>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">상태</span>
            <Badge variant={userStatusBadgeVariant[user.status]}>
              {userStatusLabel[user.status]}
            </Badge>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">등록일</span>
            <span>{user.createdAt}</span>
          </div>
        </div>
      </PageCard>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="사용자를 삭제할까요?"
        description="삭제 후 목록으로 이동합니다."
        confirmLabel="삭제"
        variant="destructive"
        loading={deleteUser.isPending}
        onConfirm={async () => {
          await deleteUser.mutateAsync(user.id);
          toast.success("사용자를 삭제했습니다.");
          router.push("/users");
        }}
      />
    </>
  );
}
