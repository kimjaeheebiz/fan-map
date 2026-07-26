"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  blur = true,
  ...props
}: DialogPrimitive.Backdrop.Props & {
  /** 배경 블러. 공통 기본값: blur-sm */
  blur?: boolean
}) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      data-blur={blur ? "" : undefined}
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/30 duration-100 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        blur && "supports-backdrop-filter:backdrop-blur-sm",
        className
      )}
      {...props}
    />
  )
}

const dialogContentVariants = cva(
  // w-[calc(100%-2rem)]: 모든 뷰포트에서 좌우 1rem 여백 유지
  // size의 max-w는 큰 화면에서만 상한으로 동작
  "fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-6 rounded-lg bg-popover p-6 text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 duration-100 outline-none dark:ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
  {
    variants: {
      size: {
        /** 1열 폼 · Confirm/Alert (~24rem) */
        sm: "sm:max-w-sm",
        /** 2열 폼 그리드 (~42rem) */
        md: "sm:max-w-2xl",
        /** 3열 폼 그리드 (~64rem) */
        lg: "sm:max-w-5xl",
        /** 4열 폼 그리드 (~88rem) */
        xl: "sm:max-w-[88rem]",
        /** 전체 (좌우 1rem 여백만 유지) */
        full: "sm:max-w-[calc(100%-2rem)]",
      },
      layout: {
        /** Confirm/Alert · 가이드용 기본 그리드 */
        default: "",
        /** 헤더 고정 + 본문 스크롤 */
        scroll:
          "flex max-h-[min(92dvh,960px)] flex-col gap-0 overflow-hidden p-0",
      },
    },
    defaultVariants: {
      size: "sm",
      layout: "default",
    },
  }
)

/** 본문 스크롤 영역 — 얇은 둥근 스크롤바 */
const dialogBodyScrollClassName = cn(
  "h-0 min-h-0 flex-1 overflow-y-auto overscroll-contain",
  "rounded-b-[inherit]",
  "[scrollbar-width:thin]",
  "[scrollbar-color:var(--color-border)_transparent]",
  "[&::-webkit-scrollbar]:w-2",
  "[&::-webkit-scrollbar-track]:bg-transparent",
  "[&::-webkit-scrollbar-thumb]:rounded-full",
  "[&::-webkit-scrollbar-thumb]:bg-border",
  "[&::-webkit-scrollbar-thumb]:border-2",
  "[&::-webkit-scrollbar-thumb]:border-transparent",
  "[&::-webkit-scrollbar-thumb]:bg-clip-padding"
)

type DialogIconButtonProps = React.ComponentProps<typeof Button> & {
  label: string
}

/** 헤더 우측 액션·닫기 공통 아이콘 버튼 (즐겨찾기·공유 등과 동일 모양) */
function DialogIconButton({
  label,
  className,
  children,
  ...props
}: DialogIconButtonProps) {
  return (
    <Button
      type="button"
      variant="secondary"
      size="icon-sm"
      aria-label={label}
      className={cn("shrink-0", className)}
      {...props}
    >
      {children}
    </Button>
  )
}

/** 헤더 액션 영역의 닫기 버튼 (DialogClose 프리미티브와 구분) */
function DialogHeaderCloseButton({
  onClick,
  className,
  ...props
}: Omit<DialogIconButtonProps, "label" | "children">) {
  return (
    <DialogIconButton
      label="닫기"
      onClick={onClick}
      className={className}
      {...props}
    >
      <XIcon />
    </DialogIconButton>
  )
}

type DialogScrollLayoutProps = {
  title: React.ReactNode
  description?: React.ReactNode
  /** 닫기 왼쪽 — 즐겨찾기·공유 등 */
  headerActions?: React.ReactNode
  showCloseButton?: boolean
  onClose?: () => void
  /**
   * 드래그 핸들 바.
   * 장소 상세를 Dialog로 띄울 때만 true.
   * BottomSheet가 핸들을 그리면 false.
   */
  showDragHandle?: boolean
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
  bodyClassName?: string
  headerClassName?: string
}

/**
 * 헤더 고정 + 본문 스크롤 레이아웃.
 * DialogContent layout="scroll" 또는 사이드 패널에서 사용.
 */
function DialogScrollLayout({
  title,
  description,
  headerActions,
  showCloseButton = true,
  onClose,
  showDragHandle = false,
  children,
  footer,
  className,
  bodyClassName,
  headerClassName,
}: DialogScrollLayoutProps) {
  return (
    <div
      className={cn("flex h-full min-h-0 flex-col overflow-hidden", className)}
    >
      {showDragHandle ? (
        <div
          className="flex h-5 shrink-0 items-center justify-center"
          aria-hidden="true"
        >
          <span className="bg-muted h-1 w-10 rounded-full" />
        </div>
      ) : null}

      <header
        className={cn(
          "flex shrink-0 items-center gap-3 border-b px-4 py-3 sm:px-6 sm:py-4",
          headerClassName
        )}
      >
        <div className="min-w-0 flex-1">
          {typeof title === "string" ? (
            <div className="font-heading text-base leading-none font-medium">
              {title}
            </div>
          ) : (
            title
          )}
          {description ? (
            typeof description === "string" ? (
              <p className="text-muted-foreground mt-1.5 text-sm text-balance">
                {description}
              </p>
            ) : (
              description
            )
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {headerActions}
          {showCloseButton && onClose ? (
            <DialogHeaderCloseButton
              onClick={onClose}
              onPointerDown={(event) => event.stopPropagation()}
            />
          ) : null}
        </div>
      </header>

      <div
        className={cn(
          dialogBodyScrollClassName,
          "px-4 py-4 sm:px-6 sm:py-5",
          bodyClassName
        )}
      >
        {children}
      </div>

      {footer ? (
        <footer className="flex shrink-0 flex-col gap-2 border-t px-4 py-3 sm:flex-row sm:justify-end sm:px-6">
          {footer}
        </footer>
      ) : null}
    </div>
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  size = "md",
  layout = "default",
  blur = true,
  ...props
}: DialogPrimitive.Popup.Props &
  VariantProps<typeof dialogContentVariants> & {
    showCloseButton?: boolean
    /** 배경 오버레이 블러 */
    blur?: boolean
  }) {
  const isScroll = layout === "scroll"

  return (
    <DialogPortal>
      <DialogOverlay blur={blur} />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        data-size={size}
        data-layout={layout ?? "default"}
        className={cn(dialogContentVariants({ size, layout }), className)}
        {...props}
      >
        {children}
        {showCloseButton && !isScroll && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-4 right-4 bg-secondary"
                size="icon-sm"
              />
            }
          >
            <XIcon />
            <span className="sr-only">닫기</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          닫기
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "font-heading text-base leading-none font-medium",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogHeaderCloseButton,
  DialogIconButton,
  DialogOverlay,
  DialogPortal,
  DialogScrollLayout,
  DialogTitle,
  DialogTrigger,
  dialogBodyScrollClassName,
  dialogContentVariants,
}
