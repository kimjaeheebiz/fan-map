"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AppPagination,
  ConfirmDialog,
  DataTable,
  PageCard,
  PageMetaHeader,
  SearchBox,
  type DataTableColumn,
} from "@/components/common";
import {
  useDeleteUser,
  useUsers,
} from "@/features/users/hooks/use-users";
import type { User } from "@/features/users/types";
import {
  userRoleLabel,
  userStatusBadgeVariant,
  userStatusLabel,
} from "@/features/users/labels";
import { getPageMeta } from "@/config/pages";

export default function UsersPage() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useUsers({ q, page, pageSize: 5 });
  const deleteUser = useDeleteUser();

  const columns = useMemo<DataTableColumn<User>[]>(
    () => [
      {
        id: "name",
        header: "이름",
        cell: (row) => <span className="font-medium">{row.name}</span>,
      },
      {
        id: "email",
        header: "이메일",
        cell: (row) => row.email,
      },
      {
        id: "role",
        header: "역할",
        cell: (row) => (
          <Badge variant="secondary">{userRoleLabel[row.role]}</Badge>
        ),
      },
      {
        id: "status",
        header: "상태",
        cell: (row) => (
          <Badge variant={userStatusBadgeVariant[row.status]}>
            {userStatusLabel[row.status]}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "작업",
        className: "w-48",
        cell: (row) => (
          <div
            className="flex gap-2"
            onClick={(event) => event.stopPropagation()}
          >
            <Button
              size="sm"
              variant="outline"
              render={<Link href={`/users/${row.id}/edit`} />}
              nativeButton={false}
            >
              수정
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setDeleteId(row.id)}
            >
              삭제
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <PageMetaHeader
        meta={getPageMeta("users")}
        actions={
          <Button render={<Link href="/users/new" />} nativeButton={false}>
            사용자 등록
          </Button>
        }
      />

      <PageCard>
        <div className="flex flex-col gap-4">
          <SearchBox
            value={q}
            onChange={(value) => {
              setQ(value);
              setPage(1);
            }}
            placeholder="이름, 이메일, 역할 검색"
          />

          <DataTable
            columns={columns}
            data={data?.items ?? []}
            getRowId={(row) => row.id}
            onRowClick={(row) => router.push(`/users/${row.id}`)}
            loading={isLoading}
            emptyTitle="사용자가 없습니다."
            emptyDescription="검색 조건을 바꾸거나 새 사용자를 추가해 주세요."
            emptyAction={
              <Button render={<Link href="/users/new" />} nativeButton={false}>
                사용자 등록
              </Button>
            }
          />

          {data && (
            <AppPagination
              page={data.page}
              pageCount={data.pageCount}
              onPageChange={setPage}
            />
          )}
        </div>
      </PageCard>

      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        title="사용자를 삭제할까요?"
        description="이 작업은 Mock 데이터에서만 반영됩니다."
        confirmLabel="삭제"
        variant="destructive"
        loading={deleteUser.isPending}
        onConfirm={async () => {
          if (!deleteId) return;
          await deleteUser.mutateAsync(deleteId);
          toast.success("사용자를 삭제했습니다.");
          setDeleteId(null);
          router.refresh();
        }}
      />
    </>
  );
}
