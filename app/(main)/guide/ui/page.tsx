"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AppPagination,
  AppSkeleton,
  ConfirmDialog,
  EmptyState,
  Loading,
  PageCard,
  PageMetaHeader,
  Skeleton,
} from "@/components/common";
import {
  GuideNav,
  GuideSection,
} from "@/components/common/guide-section";
import { getPageMeta } from "@/config/pages";
import { toast } from "sonner";

const navItems = [
  { id: "typography", label: "Typography" },
  { id: "color", label: "Color" },
  { id: "button", label: "Button" },
  { id: "badge", label: "Badge" },
  { id: "card", label: "Card" },
  { id: "input", label: "Input" },
  { id: "textarea", label: "Textarea" },
  { id: "select", label: "Select" },
  { id: "checkbox", label: "Checkbox" },
  { id: "radio", label: "Radio" },
  { id: "switch", label: "Switch" },
  { id: "dialog", label: "Dialog" },
  { id: "drawer", label: "Drawer" },
  { id: "tabs", label: "Tabs" },
  { id: "table", label: "Table" },
  { id: "pagination", label: "Pagination" },
  { id: "tooltip", label: "Tooltip" },
  { id: "avatar", label: "Avatar" },
  { id: "skeleton", label: "Skeleton" },
  { id: "loading", label: "Loading" },
  { id: "empty", label: "EmptyState" },
];

export default function GuideUiPage() {
  const [page, setPage] = useState(1);
  const [checked, setChecked] = useState(true);
  const [enabled, setEnabled] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  return (
    <>
      <PageMetaHeader meta={getPageMeta("guideUi")} />

      <PageCard>
      <GuideNav items={navItems} />

      <GuideSection id="typography" title="Typography">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold">Heading 1</h1>
          <h2 className="text-3xl font-semibold">Heading 2</h2>
          <h3 className="text-2xl font-semibold">Heading 3</h3>
          <h4 className="text-xl font-semibold">Heading 4</h4>
          <h5 className="text-lg font-semibold">Heading 5</h5>
          <h6 className="text-base font-semibold">Heading 6</h6>
          <p>Body text — 본문 텍스트 예시입니다.</p>
          <p className="text-muted-foreground text-xs">Muted / caption text</p>
          <div className="flex flex-wrap gap-4 pt-2">
            <span className="font-thin">font-thin</span>
            <span className="font-extralight">font-extralight</span>
            <span className="font-light">font-light</span>
            <span className="font-normal">font-normal</span>
            <span className="font-medium">font-medium</span>
            <span className="font-semibold">font-semibold</span>
            <span className="font-bold">font-bold</span>
            <span className="font-extrabold">font-extrabold</span>
            <span className="font-black">font-black</span>
          </div>
          <div className="flex flex-wrap gap-4 pt-2 font-medium">
            <span className="text-info">text-info</span>
            <span className="text-success">text-success</span>
            <span className="text-warning">text-warning</span>
            <span className="text-error">text-error</span>
            <span className="text-wait">text-wait</span>
          </div>
        </div>
      </GuideSection>

      <GuideSection
        id="color"
        title="Color"
        description="Design token colors (CSS variables)"
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["background", "bg-background border"],
            ["canvas", "bg-canvas border"],
            ["foreground", "bg-foreground"],
            ["primary", "bg-primary"],
            ["secondary", "bg-secondary"],
            ["muted", "bg-muted"],
            ["accent", "bg-accent"],
            ["destructive", "bg-destructive"],
            ["info", "bg-info"],
            ["success", "bg-success"],
            ["warning", "bg-warning"],
            ["error", "bg-error"],
            ["wait", "bg-wait"],
            ["card", "bg-card border"],
          ].map(([name, className]) => (
            <div key={name} className="flex flex-col gap-2">
              <div className={`h-14 rounded-lg ${className}`} />
              <span className="text-muted-foreground font-mono text-xs">
                {name}
              </span>
            </div>
          ))}
        </div>
      </GuideSection>

      <GuideSection id="button" title="Button">
        <div className="flex flex-wrap gap-2">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
      </GuideSection>

      <GuideSection id="badge" title="Badge">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="ghost">Ghost</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="info">Info</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="wait">Wait</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="info">안내</Badge>
            <Badge variant="success">성공</Badge>
            <Badge variant="warning">경고</Badge>
            <Badge variant="error">실패</Badge>
            <Badge variant="wait">대기</Badge>
          </div>
        </div>
      </GuideSection>

      <GuideSection id="card" title="Card">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description</CardDescription>
          </CardHeader>
          <CardContent>Card content</CardContent>
        </Card>
      </GuideSection>

      <GuideSection
        id="input"
        title="Input"
        description="Types + Default / readOnly / disabled"
      >
        <div className="flex flex-col gap-6">
          <div className="grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(
              [
                ["text", "Text"],
                ["number", "Number"],
                ["password", "Password"],
                ["email", "Email"],
                ["search", "Search"],
                ["tel", "Tel"],
                ["url", "URL"],
                ["date", "Date"],
                ["time", "Time"],
                ["file", "File"],
              ] as const
            ).map(([type, label]) => (
              <div key={type} className="space-y-2">
                <Label htmlFor={`guide-input-${type}`}>
                  type=&quot;{type}&quot;
                </Label>
                <Input
                  id={`guide-input-${type}`}
                  type={type}
                  placeholder={label}
                  defaultValue={
                    type === "number"
                      ? "123"
                      : type === "password"
                        ? "password"
                        : type === "email"
                          ? "name@example.com"
                          : type === "tel"
                            ? "010-0000-0000"
                            : type === "url"
                              ? "https://example.com"
                              : type === "date" || type === "time" || type === "file"
                                ? undefined
                                : label
                  }
                />
              </div>
            ))}
          </div>

          <div className="grid max-w-3xl gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="guide-input-default">Default</Label>
              <Input id="guide-input-default" placeholder="Placeholder" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guide-input-readonly">ReadOnly</Label>
              <Input
                id="guide-input-readonly"
                defaultValue="Read only value"
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guide-input-disabled">Disabled</Label>
              <Input
                id="guide-input-disabled"
                defaultValue="Disabled value"
                disabled
              />
            </div>
          </div>
        </div>
      </GuideSection>

      <GuideSection
        id="textarea"
        title="Textarea"
        description="Default / readOnly / disabled"
      >
        <div className="grid max-w-4xl gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="guide-textarea-default">Default</Label>
            <Textarea
              id="guide-textarea-default"
              placeholder="Enter text..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guide-textarea-readonly">ReadOnly</Label>
            <Textarea
              id="guide-textarea-readonly"
              defaultValue="Read only content"
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guide-textarea-disabled">Disabled</Label>
            <Textarea
              id="guide-textarea-disabled"
              defaultValue="Disabled content"
              disabled
            />
          </div>
        </div>
      </GuideSection>

      <GuideSection
        id="select"
        title="Select"
        description="Default / disabled (readOnly 미지원)"
      >
        <div className="flex flex-wrap gap-4">
          <div className="space-y-2">
            <Label>Default</Label>
            <Select
              defaultValue="apple"
              items={[
                { value: "apple", label: "Apple" },
                { value: "banana", label: "Banana" },
                { value: "orange", label: "Orange" },
              ]}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Disabled</Label>
            <Select
              defaultValue="apple"
              disabled
              items={[{ value: "apple", label: "Apple" }]}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </GuideSection>

      <GuideSection
        id="checkbox"
        title="Checkbox"
        description="Default / disabled (readOnly 미지원)"
      >
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2">
            <Checkbox
              checked={checked}
              onCheckedChange={(value) => setChecked(Boolean(value))}
            />
            Default
          </label>
          <label className="text-muted-foreground flex items-center gap-2">
            <Checkbox checked disabled />
            Disabled (checked)
          </label>
          <label className="text-muted-foreground flex items-center gap-2">
            <Checkbox disabled />
            Disabled (unchecked)
          </label>
        </div>
      </GuideSection>

      <GuideSection
        id="radio"
        title="Radio"
        description="Default / disabled (readOnly 미지원)"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
          <RadioGroup defaultValue="a" className="gap-3">
            <p className="font-medium">Default</p>
            <label className="flex items-center gap-2">
              <RadioGroupItem value="a" />
              Option A
            </label>
            <label className="flex items-center gap-2">
              <RadioGroupItem value="b" />
              Option B
            </label>
          </RadioGroup>
          <RadioGroup defaultValue="a" disabled className="gap-3">
            <p className="text-muted-foreground font-medium">
              Disabled
            </p>
            <label className="text-muted-foreground flex items-center gap-2">
              <RadioGroupItem value="a" />
              Option A
            </label>
            <label className="text-muted-foreground flex items-center gap-2">
              <RadioGroupItem value="b" />
              Option B
            </label>
          </RadioGroup>
        </div>
      </GuideSection>

      <GuideSection
        id="switch"
        title="Switch"
        description="Default / disabled (readOnly 미지원)"
      >
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2">
            <Switch checked={enabled} onCheckedChange={setEnabled} />
            Default
          </label>
          <label className="text-muted-foreground flex items-center gap-2">
            <Switch checked disabled />
            Disabled (on)
          </label>
          <label className="text-muted-foreground flex items-center gap-2">
            <Switch disabled />
            Disabled (off)
          </label>
        </div>
      </GuideSection>

      <GuideSection
        id="dialog"
        title="Dialog"
        description="sm 1열 · md 2열 · lg 3열 · xl 4열 · full"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Dialog disablePointerDismissal>
              <DialogTrigger render={<Button variant="outline" />}>
                Default
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog Title</DialogTitle>
                  <DialogDescription>
                    기본 크기 (sm) — 1열 폼 · 백드롭 클릭으로 닫히지 않음
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline" />}>
                    취소
                  </DialogClose>
                  <Button>저장</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {(
              [
                { size: "sm", cols: 1, label: "1열 폼" },
                { size: "md", cols: 2, label: "2열 폼" },
                { size: "lg", cols: 3, label: "3열 폼" },
                { size: "xl", cols: 4, label: "4열 폼" },
                { size: "full", cols: 4, label: "전체" },
              ] as const
            ).map(({ size, cols, label }) => (
              <Dialog key={size} disablePointerDismissal>
                <DialogTrigger render={<Button variant="outline" />}>
                  {size} · {label}
                </DialogTrigger>
                <DialogContent size={size}>
                  <DialogHeader>
                    <DialogTitle>
                      size=&quot;{size}&quot;
                    </DialogTitle>
                    <DialogDescription>{label}</DialogDescription>
                  </DialogHeader>
                  <div
                    className="grid gap-3"
                    style={{
                      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                    }}
                  >
                    {Array.from({ length: cols }, (_, i) => (
                      <div
                        key={i}
                        className="bg-muted text-muted-foreground flex h-9 items-center justify-center rounded-lg text-xs"
                      >
                        Field {i + 1}
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setConfirmOpen(true)}>
              Confirm
            </Button>
            <Button variant="outline" onClick={() => setAlertOpen(true)}>
              Alert
            </Button>
          </div>
        </div>

        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Confirm action"
          description="확인 / 취소가 있는 Confirm Dialog입니다."
          onConfirm={() => {
            toast.success("Confirmed");
            setConfirmOpen(false);
          }}
        />

        <AlertDialog
          open={alertOpen}
          onOpenChange={setAlertOpen}
          title="Alert"
          description="확인 버튼만 있는 Alert Dialog입니다."
        />
      </GuideSection>

      <GuideSection id="drawer" title="Drawer">
        <Drawer>
          <DrawerTrigger render={<Button variant="outline" />}>
            Open Drawer
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Drawer Title</DrawerTitle>
              <DrawerDescription>Drawer description</DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      </GuideSection>

      <GuideSection id="tabs" title="Tabs">
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            Account tab content
          </TabsContent>
          <TabsContent value="password">
            Password tab content
          </TabsContent>
        </Tabs>
      </GuideSection>

      <GuideSection id="table" title="Table">
        <div className="border-border overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Kim</TableCell>
                <TableCell>Admin</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Lee</TableCell>
                <TableCell>Editor</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </GuideSection>

      <GuideSection id="pagination" title="Pagination">
        <AppPagination page={page} pageCount={8} onPageChange={setPage} />
      </GuideSection>

      <GuideSection id="tooltip" title="Tooltip">
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>
            Hover me
          </TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </GuideSection>

      <GuideSection id="avatar" title="Avatar">
        <div className="flex gap-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="avatar" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>WS</AvatarFallback>
          </Avatar>
        </div>
      </GuideSection>

      <GuideSection id="skeleton" title="Skeleton">
        <div className="max-w-md space-y-3">
          <Skeleton className="h-8 w-40" />
          <AppSkeleton rows={3} />
        </div>
      </GuideSection>

      <GuideSection id="loading" title="Loading">
        <Loading />
      </GuideSection>

      <GuideSection id="empty" title="EmptyState">
        <EmptyState
          title="No items"
          description="Try adding a new item."
          action={<Button size="sm">Add item</Button>}
        />
      </GuideSection>
      </PageCard>
    </>
  );
}
