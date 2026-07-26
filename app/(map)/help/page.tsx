"use client";

import { AccountPageShell } from "@/features/account/components/account-page-shell";
import { authNav } from "@/config/navigation";
import { PageCard } from "@/components/common/page-card";

const faqs = [
  {
    q: "방문 경험은 어떻게 남기나요?",
    a: "지도에서 장소를 선택하거나 헤더의 다녀왔어요 버튼을 누른 뒤, 네이버 검색으로 상호를 고르고 방문 경험을 입력합니다. 로그인이 필요합니다.",
  },
  {
    q: "카카오 로그인이 실제로 연동되나요?",
    a: "현재는 UI 확인용 Mock입니다. 실제 카카오 OAuth는 이후 단계에서 연동됩니다.",
  },
  {
    q: "남긴 내용은 어디에 저장되나요?",
    a: "PoC 단계에서는 브라우저 localStorage에 저장됩니다. 기기·브라우저를 바꾸면 보이지 않을 수 있습니다.",
  },
  {
    q: "즐겨찾기는 동기화되나요?",
    a: "로그인한 계정 기준으로 이 기기(브라우저)에 저장됩니다. 로그아웃하면 즐겨찾기 표시가 사라지고, 다시 로그인하면 해당 계정의 목록이 보입니다. 서버 동기화는 후속 기능입니다.",
  },
];

export default function HelpPage() {
  return (
    <AccountPageShell
      title="자주 묻는 질문"
      description="서비스 이용에 대해 궁금한 점을 확인하세요."
      requireAuth={false}
      backHref={authNav.mypage}
    >
      <ul className="space-y-3">
        {faqs.map((item) => (
          <li key={item.q}>
            <PageCard>
              <div className="space-y-1.5">
                <p className="text-sm font-medium">Q. {item.q}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  A. {item.a}
                </p>
              </div>
            </PageCard>
          </li>
        ))}
      </ul>
    </AccountPageShell>
  );
}
