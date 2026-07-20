"use client";

import { HorizontalScroll } from "@/components/common/horizontal-scroll";
import { cn } from "@/lib/utils";

type PlaceImageGalleryProps = {
  images: string[];
  className?: string;
  imageClassName?: string;
};

export function PlaceImageGallery({
  images,
  className,
  imageClassName,
}: PlaceImageGalleryProps) {
  if (images.length === 0) return null;

  return (
    <HorizontalScroll
      className={className}
      contentClassName="gap-2 pb-1 snap-x snap-mandatory"
    >
      {images.map((src, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${src}-${index}`}
          src={src}
          alt=""
          className={cn(
            "bg-muted h-44 w-64 shrink-0 snap-start rounded-xl object-cover",
            imageClassName,
          )}
        />
      ))}
    </HorizontalScroll>
  );
}
