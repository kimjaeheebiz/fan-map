"use client";

import type { ReactNode } from "react";
import {
  PageMetaHeader,
  ThemeSwitcher,
} from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type {
  ContainerWidth,
  HeaderMode,
  LayoutMode,
  PrimaryColor,
  RadiusSize,
  SidebarMode,
} from "@/config/app";
import { getPageMeta } from "@/config/pages";
import { useAppConfig } from "@/providers/theme-provider";
import { cn } from "@/lib/utils";

const primaryColors: PrimaryColor[] = [
  "blue",
  "green",
  "orange",
  "red",
  "violet",
  "rose",
  "zinc",
];

const radii: RadiusSize[] = ["none", "sm", "md", "lg", "xl"];
const layouts: LayoutMode[] = ["vertical", "horizontal"];
const sidebars: SidebarMode[] = ["expanded", "collapsed"];
const headers: HeaderMode[] = ["fixed", "static"];
const widths: ContainerWidth[] = ["sm", "md", "lg", "full"];

const radiusItems = radii.map((value) => ({ value, label: value }));
const layoutItems = layouts.map((value) => ({ value, label: value }));
const sidebarItems = sidebars.map((value) => ({ value, label: value }));
const headerItems = headers.map((value) => ({ value, label: value }));
const widthItems = widths.map((value) => ({ value, label: value }));

function ConfigCardTitle({
  title,
  code,
  className,
}: {
  title: string;
  code: string;
  className?: string;
}) {
  return (
    <CardTitle className={cn("flex flex-wrap items-center gap-2", className)}>
      <span>{title}</span>
      <code className="bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 text-xs font-normal">
        {code}
      </code>
    </CardTitle>
  );
}

function SettingCard({
  title,
  code,
  description,
  children,
}: {
  title: string;
  code: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <ConfigCardTitle title={title} code={code} />
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default function GuideThemePage() {
  const { config, setConfig, resetConfig } = useAppConfig();

  return (
    <>
      <PageMetaHeader
        meta={getPageMeta("guideTheme")}
        actions={
          <Button type="button" variant="outline" onClick={resetConfig}>
            초기화
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <SettingCard
          title="테마 모드"
          code="theme"
          description="light / dark / system"
        >
          <ThemeSwitcher variant="group" />
        </SettingCard>

        <SettingCard
          title="주 색상"
          code="primaryColor"
          description={`현재: ${config.primaryColor}`}
        >
          <div className="flex flex-wrap gap-2">
            {primaryColors.map((color) => (
              <Button
                key={color}
                size="sm"
                variant={
                  config.primaryColor === color ? "default" : "outline"
                }
                onClick={() => setConfig({ primaryColor: color })}
              >
                {color}
              </Button>
            ))}
          </div>
        </SettingCard>

        <SettingCard title="라운드" code="radius">
          <Select
            value={config.radius}
            onValueChange={(value) =>
              setConfig({ radius: value as RadiusSize })
            }
            items={radiusItems}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {radiusItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingCard>

        <SettingCard title="레이아웃" code="layout">
          <Select
            value={config.layout}
            onValueChange={(value) =>
              setConfig({ layout: value as LayoutMode })
            }
            items={layoutItems}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {layoutItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingCard>

        <SettingCard
          title="사이드바"
          code="sidebar"
          description="vertical 레이아웃에서만 표시"
        >
          <Select
            value={config.sidebar}
            onValueChange={(value) =>
              setConfig({ sidebar: value as SidebarMode })
            }
            items={sidebarItems}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sidebarItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingCard>

        <SettingCard title="헤더" code="header">
          <Select
            value={config.header}
            onValueChange={(value) =>
              setConfig({ header: value as HeaderMode })
            }
            items={headerItems}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {headerItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingCard>

        <SettingCard title="컨테이너 너비" code="containerWidth">
          <Select
            value={config.containerWidth}
            onValueChange={(value) =>
              setConfig({ containerWidth: value as ContainerWidth })
            }
            items={widthItems}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {widthItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingCard>

        <SettingCard title="푸터" code="footer">
          <label className="flex items-center gap-3">
            <Switch
              checked={config.footer}
              onCheckedChange={(checked) => setConfig({ footer: checked })}
            />
            <Label>footer 표시</Label>
          </label>
        </SettingCard>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>미리보기</CardTitle>
          <CardDescription>
            primaryColor / radius 적용 미리보기
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Button>기본 버튼</Button>
          <Button variant="secondary">보조</Button>
          <Button variant="outline">아웃라인</Button>
          <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2">
            라운드 샘플
          </div>
        </CardContent>
      </Card>
    </>
  );
}
