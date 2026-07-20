import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AppProviders } from "@/providers/app-providers";
import { appConfig } from "@/config/app";

export const metadata: Metadata = {
  title: appConfig.name,
  description:
    "스포츠 관람 장소를 지도에서 찾고, 실제 관람 경험을 공유하는 Fan Map",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", "font-sans")}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
