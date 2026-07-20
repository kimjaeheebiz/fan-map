import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageMetaHeader } from "@/components/common";
import { getPageMeta } from "@/config/pages";

const patterns = [
  {
    title: "Dashboard",
    href: "/dashboard",
    description: "통계 카드와 요약 영역으로 구성된 대시보드 패턴",
  },
  {
    title: "List",
    href: "/users",
    description: "검색 + 테이블 + 페이지네이션 + Empty/Loading",
  },
  {
    title: "Detail",
    href: "/users/1",
    description: "상세 정보와 액션(수정/삭제) 패턴",
  },
  {
    title: "Create",
    href: "/users/new",
    description: "등록 폼 (UserForm 재사용)",
  },
  {
    title: "Edit",
    href: "/users/1/edit",
    description: "수정 폼 (Create와 동일한 Form)",
  },
  {
    title: "Login",
    href: "/login",
    description: "Auth Layout 기반 로그인 화면",
  },
];

export default function GuidePatternPage() {
  return (
    <>
      <PageMetaHeader meta={getPageMeta("guidePattern")} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {patterns.map((pattern) => (
          <Card key={pattern.title}>
            <CardHeader>
              <CardTitle>{pattern.title}</CardTitle>
              <CardDescription>{pattern.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                size="sm"
                render={<Link href={pattern.href} />}
                nativeButton={false}
              >
                화면 보기
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
