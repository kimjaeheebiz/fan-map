import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageMetaHeader } from "@/components/common";
import { getPageMeta } from "@/config/pages";

const stats = [
  { title: "사용자", value: "1,248", description: "활성 사용자" },
  { title: "세션", value: "3,902", description: "이번 주 세션" },
  { title: "전환율", value: "4.8%", description: "전환율" },
  { title: "매출", value: "$12.4k", description: "월 매출" },
];

export default function DashboardPage() {
  return (
    <>
      <PageMetaHeader
        meta={getPageMeta("dashboard")}
        actions={
          <Button render={<Link href="/users" />} nativeButton={false}>
            사용자
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <CardDescription>{stat.title}</CardDescription>
              <CardTitle className="text-2xl">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>최근 활동</CardTitle>
            <CardDescription>최근 활동 요약 (Mock)</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2">
            <p>새 사용자 12명이 등록되었습니다.</p>
            <p>가이드 테마 설정이 업데이트되었습니다.</p>
            <p>사용자 CRUD 샘플 데이터가 동기화되었습니다.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>바로가기</CardTitle>
            <CardDescription>자주 사용하는 화면</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/users" />}
              nativeButton={false}
            >
              사용자 목록
            </Button>
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/guide/ui" />}
              nativeButton={false}
            >
              UI 가이드
            </Button>
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/guide/theme" />}
              nativeButton={false}
            >
              테마 가이드
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
