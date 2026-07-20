"use client";

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
    <div
      className={cn(
        "flex gap-2 overflow-x-auto overscroll-x-contain pb-1 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
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
    </div>
  );
}
