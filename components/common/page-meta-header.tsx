import type { ReactNode } from "react";
import { AppBreadcrumb } from "@/components/common/app-breadcrumb";
import { PageHeader } from "@/components/common/page-header";
import type { PageMeta } from "@/config/pages";

/** config/pages.ts 메타로 PageHeader + Breadcrumb를 렌더한다. */
export function PageMetaHeader({
  meta,
  actions,
}: {
  meta: PageMeta;
  actions?: ReactNode;
}) {
  return (
    <PageHeader
      title={meta.title}
      description={meta.description}
      breadcrumb={<AppBreadcrumb items={meta.breadcrumb} />}
      actions={actions}
    />
  );
}
