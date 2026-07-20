"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageCard, PageMetaHeader } from "@/components/common";
import { UserForm } from "@/features/users/components/user-form";
import { useCreateUser } from "@/features/users/hooks/use-users";
import { getPageMeta } from "@/config/pages";

export default function CreateUserPage() {
  const router = useRouter();
  const createUser = useCreateUser();

  return (
    <>
      <PageMetaHeader meta={getPageMeta("usersNew")} />
      <PageCard>
        <UserForm
          submitLabel="등록"
          onCancel={() => router.push("/users")}
          onSubmit={async (values) => {
            const user = await createUser.mutateAsync(values);
            toast.success("사용자를 등록했습니다.");
            router.push(`/users/${user.id}`);
          }}
        />
      </PageCard>
    </>
  );
}
