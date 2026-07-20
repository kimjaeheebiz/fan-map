"use client";

import type { ReactNode } from "react";
import {
  Controller,
  type Control,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { CircleHelp } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type FormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  /** true면 라벨 옆에 필수 표시(*) */
  required?: boolean;
  /** 라벨 옆 ? 아이콘 툴팁 */
  tooltip?: ReactNode;
  description?: string;
  className?: string;
  children: (field: ControllerRenderProps<T, FieldPath<T>>) => ReactNode;
};

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  required,
  tooltip,
  description,
  className,
  children,
}: FormFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={cn("flex flex-col gap-2", className)}>
          {label && (
            <Label htmlFor={name}>
              {label}
              {required && (
                <span className="text-destructive" aria-hidden>
                  *
                </span>
              )}
              {tooltip && (
                <Tooltip>
                  <TooltipTrigger
                    type="button"
                    className="text-muted-foreground hover:text-foreground inline-flex size-4 items-center justify-center rounded-full"
                    aria-label={`${label} 도움말`}
                    onClick={(event) => event.preventDefault()}
                  >
                    <CircleHelp className="size-3.5" />
                  </TooltipTrigger>
                  <TooltipContent>{tooltip}</TooltipContent>
                </Tooltip>
              )}
            </Label>
          )}
          {children(field)}
          {description && !fieldState.error && (
            <p className="text-muted-foreground text-xs">{description}</p>
          )}
          {fieldState.error?.message && (
            <p className="text-destructive text-xs" role="alert">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
