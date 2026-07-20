"use client";

import { useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  MAX_REPORT_IMAGES,
  compressImages,
  ImageProcessingError,
} from "@/features/places/lib/image-utils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ImagePickerProps = {
  value: string[];
  onChange: (images: string[]) => void;
  disabled?: boolean;
  className?: string;
};

export function ImagePicker({
  value,
  onChange,
  disabled = false,
  className,
}: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const remaining = MAX_REPORT_IMAGES - value.length;

  async function handleFilesSelected(files: FileList | null) {
    if (!files || files.length === 0) return;

    const selected = Array.from(files).slice(0, remaining);
    if (selected.length === 0) {
      toast.message(`사진은 최대 ${MAX_REPORT_IMAGES}장까지 추가할 수 있습니다.`);
      return;
    }

    try {
      const compressed = await compressImages(selected);
      onChange([...value, ...compressed]);
    } catch (error) {
      toast.error(
        error instanceof ImageProcessingError
          ? error.message
          : "사진을 처리하지 못했습니다.",
      );
    } finally {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function removeImage(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">사진</p>
        <p className="text-muted-foreground text-xs">
          {value.length}/{MAX_REPORT_IMAGES}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {value.map((image, index) => (
          <div
            key={`${image.slice(0, 32)}-${index}`}
            className="relative size-20 overflow-hidden rounded-md border"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={`첨부 사진 ${index + 1}`}
              className="size-full object-cover"
            />
            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              className="absolute top-1 right-1 size-6 shadow-sm"
              aria-label="사진 삭제"
              disabled={disabled}
              onClick={() => removeImage(index)}
            >
              <X className="size-3.5" />
            </Button>
          </div>
        ))}

        {remaining > 0 && (
          <>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              disabled={disabled}
              onChange={(event) => void handleFilesSelected(event.target.files)}
            />
            <button
              type="button"
              disabled={disabled}
              className="border-border text-muted-foreground hover:bg-muted/50 flex size-20 flex-col items-center justify-center gap-1 rounded-md border border-dashed text-xs transition-colors disabled:opacity-50"
              onClick={() => inputRef.current?.click()}
            >
              <ImagePlus className="size-5" />
              추가
            </button>
          </>
        )}
      </div>

      <p className="text-muted-foreground text-xs">
        사진은 자동으로 줄여 저장됩니다. 용량이 크면 저장에 실패할 수 있어요.
      </p>
    </div>
  );
}
