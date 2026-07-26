"use client";

import { AccountPageShell } from "@/features/account/components/account-page-shell";
import { authNav } from "@/config/navigation";
import { PageCard } from "@/components/common/page-card";

export default function TermsPage() {
  return (
    <AccountPageShell
      title="이용약관"
      description="서비스 이용에 관한 기본 안내입니다. (Mock)"
      requireAuth={false}
      backHref={authNav.mypage}
    >
      <PageCard>
        <article className="space-y-4 text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-medium">제1조 (목적)</h2>
            <p className="text-muted-foreground">
              본 약관은 Fan Map 서비스(이하 “서비스”)의 이용 조건과 절차, 회원과
              운영자 간의 권리·의무를 규정합니다.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="font-medium">제2조 (서비스 내용)</h2>
            <p className="text-muted-foreground">
              서비스는 응원·방문 장소 탐색, 방문 경험 공유, 즐겨찾기 등 기능을
              제공합니다. PoC 단계의 기능·데이터는 예고 없이 변경될 수 있습니다.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="font-medium">제3조 (회원의 의무)</h2>
            <p className="text-muted-foreground">
              회원은 허위 기록·타인 권리 침해·불법 콘텐츠를 게시해서는 안
              됩니다. 방문 전 매장에 영업·이용 가능 여부를 확인해 주세요.
            </p>
          </section>
          <p className="text-muted-foreground text-xs">
            본 문서는 UI 확인용 Mock이며 법적 효력이 있는 최종 약관이 아닙니다.
          </p>
        </article>
      </PageCard>
    </AccountPageShell>
  );
}
