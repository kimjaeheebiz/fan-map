"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageCard, PageMetaHeader, Loading } from "@/components/common";
import { UserForm } from "@/features/users/components/user-form";
import { useUpdateUser, useUser } from "@/features/users/hooks/use-users";
import { getPageMeta, getUserEditPageMeta } from "@/config/pages";

export default function EditUserPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: user, isLoading } = useUser(params.id);
  const updateUser = useUpdateUser(params.id);

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
      <PageMetaHeader meta={getUserEditPageMeta(user)} />
      <PageCard>
        <UserForm
          submitLabel="수정"
          defaultValues={{
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
          }}
          onCancel={() => router.push(`/users/${user.id}`)}
          onSubmit={async (values) => {
            await updateUser.mutateAsync(values);
            toast.success("사용자 정보를 수정했습니다.");
            router.push(`/users/${user.id}`);
          }}
        />
      </PageCard>
    </>
  );
}
