import { PageCard, PageMetaHeader } from "@/components/common";
import { getPageMeta } from "@/config/pages";

export default function BlankPage() {
  return (
    <>
      <PageMetaHeader meta={getPageMeta("blank")} />
      <PageCard>
        <div className="border-border text-muted-foreground flex min-h-64 items-center justify-center rounded-xl border border-dashed">
          콘텐츠 영역
        </div>
      </PageCard>
    </>
  );
}
