"use client";

import { AccountPageShell } from "@/features/account/components/account-page-shell";
import { authNav } from "@/config/navigation";
import { PageCard } from "@/components/common/page-card";

export default function PrivacyPage() {
  return (
    <AccountPageShell
      title="개인정보 처리방침"
      description="개인정보 수집·이용에 관한 안내입니다. (Mock)"
      requireAuth={false}
      backHref={authNav.mypage}
    >
      <PageCard>
        <article className="space-y-4 text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-medium">1. 수집 항목</h2>
            <p className="text-muted-foreground">
              PoC Mock 단계에서는 닉네임, 로그인 제공자(카카오), 기기 내 저장
              데이터(방문 경험·즐겨찾기 등)를 다룹니다.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="font-medium">2. 이용 목적</h2>
            <p className="text-muted-foreground">
              회원 식별, 방문 경험·즐겨찾기 기능 제공, 서비스 개선을 위해 사용합니다.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="font-medium">3. 보관</h2>
            <p className="text-muted-foreground">
              현재는 브라우저 localStorage에 저장되며, 회원 탈퇴(Mock) 시 계정
              세션·프로필 데이터를 삭제합니다.
            </p>
          </section>
          <p className="text-muted-foreground text-xs">
            본 문서는 UI 확인용 Mock이며 실제 운영 방침이 확정되면 교체됩니다.
          </p>
        </article>
      </PageCard>
    </AccountPageShell>
  );
}
