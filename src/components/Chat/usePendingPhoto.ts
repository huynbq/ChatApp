import { type ChangeEvent,useEffect, useRef, useState } from "react";

export type PendingPhoto = {
  file: File;
  id: string;
  previewUrl: string;
};

export function usePendingPhoto() {
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingPhotoRef = useRef<PendingPhoto | null>(null);
  const [pendingPhoto, setPendingPhoto] = useState<PendingPhoto | null>(null);

  useEffect(() => {
    pendingPhotoRef.current = pendingPhoto;
  }, [pendingPhoto]);

  useEffect(
    () => () => {
      if (pendingPhotoRef.current) {
        URL.revokeObjectURL(pendingPhotoRef.current.previewUrl);
      }
    },
    [],
  );

  const handlePhotoSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = Array.from(event.target.files ?? []).find((item) =>
      item.type.startsWith("image/"),
    );
    event.target.value = "";

    if (!file) return;

    setPendingPhoto((current) => {
      if (current) URL.revokeObjectURL(current.previewUrl);

      return {
        file,
        id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
        previewUrl: URL.createObjectURL(file),
      };
    });
  };

  const removePendingPhoto = () => {
    setPendingPhoto((current) => {
      if (current) URL.revokeObjectURL(current.previewUrl);
      return null;
    });
  };

  const clearPendingPhoto = () => {
    const photo = pendingPhotoRef.current;
    setPendingPhoto(null);
    if (photo) URL.revokeObjectURL(photo.previewUrl);
  };

  return {
    clearPendingPhoto,
    handlePhotoSelect,
    inputRef,
    pendingPhoto,
    removePendingPhoto,
  };
}
