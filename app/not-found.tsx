import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-muted-foreground text-6xl font-semibold tracking-wide uppercase">
        404
      </p>
      <h1 className="text-3xl font-semibold tracking-tight">
        페이지를 찾을 수 없습니다.
      </h1>
      <p className="text-muted-foreground max-w-md">
        요청하신 주소가 변경되었거나 존재하지 않습니다.
      </p>
      <Button render={<Link href="/" />} nativeButton={false}>
        홈으로 돌아가기
      </Button>
    </div>
  );
}
