import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageCard } from "@/components/common";
import { appConfig } from "@/config/app";

export default function HomePage() {
  return (
    <PageCard>
      <div className="flex flex-col gap-10">
        <section className="flex flex-col gap-5">
          <p className="text-primary text-base font-medium">
            Next.js 스타터
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl">
            {appConfig.name}
          </h1>
          <p className="text-muted-foreground max-w-2xl text-base">
            관리자, 랜딩, SaaS, 사내 시스템을 빠르게 시작하는 공통 기반입니다.<br />
            테마·레이아웃은 설정만 바꾸면 되고, CRUD·가이드 패턴을 바로 재사용할 수 있습니다.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button render={<Link href="/dashboard" />} nativeButton={false}>
              대시보드 보기
            </Button>
            <Button
              variant="outline"
              render={<Link href="/guide/ui" />}
              nativeButton={false}
            >
              UI 가이드
            </Button>
            <Button
              variant="ghost"
              render={<Link href="/login" />}
              nativeButton={false}
            >
              로그인
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "테마",
              body: "주 색상, 라운드, 레이아웃, 사이드바를 설정 파일로 제어합니다.",
            },
            {
              title: "CRUD 패턴",
              body: "사용자 도메인으로 목록·상세·등록·수정 패턴을 제공합니다.",
            },
            {
              title: "가이드",
              body: "UI / 패턴 / 테마 가이드로 확장 방법을 확인할 수 있습니다.",
            },
          ].map((item) => (
            <div key={item.title} className="bg-muted/60 rounded-2xl p-5">
              <h2 className="mb-2 text-base font-semibold">{item.title}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </section>
      </div>
    </PageCard>
  );
}
