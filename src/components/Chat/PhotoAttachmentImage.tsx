import { useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { getPublicAttachmentUrl } from "@/lib/storage";
import { cn } from "@/lib/utils";

export function PhotoAttachmentImage({
  alt,
  bucket,
  path,
}: {
  alt: string;
  bucket: string;
  path: string;
}) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="bg-muted relative h-48 w-72 max-w-full overflow-hidden rounded-xl">
      {isLoading ? (
        <Skeleton className="photo-skeleton-shimmer absolute inset-0 h-full w-full" />
      ) : null}
      <img
        src={getPublicAttachmentUrl(bucket, path)}
        alt={alt}
        className={cn(
          "h-full w-full rounded-xl object-cover transition-opacity",
          isLoading ? "opacity-0" : "opacity-100",
        )}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
    </div>
  );
}
