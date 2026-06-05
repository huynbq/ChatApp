import { ArrowUp, Plus, X } from "lucide-react";
import type { RefObject } from "react";

import { Button } from "@/components/ui/button";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";

import type { PendingPhoto } from "./usePendingPhoto";

export function ChatComposer({
  disabled,
  isLoading,
  onPhotoSelect,
  onRemovePhoto,
  onSubmit,
  pendingPhoto,
  photoInputRef,
  prompt,
  setPrompt,
}: {
  disabled: boolean;
  isLoading: boolean;
  onPhotoSelect: React.ChangeEventHandler<HTMLInputElement>;
  onRemovePhoto: () => void;
  onSubmit: () => void;
  pendingPhoto: PendingPhoto | null;
  photoInputRef: RefObject<HTMLInputElement | null>;
  prompt: string;
  setPrompt: (value: string) => void;
}) {
  return (
    <PromptInput
      isLoading={isLoading}
      value={prompt}
      onValueChange={setPrompt}
      onSubmit={onSubmit}
      className="border-input bg-popover relative z-10 w-full rounded-3xl border p-0 pt-1 shadow-xs"
    >
      <div className="flex flex-col">
        <PromptInputTextarea
          placeholder="Type anything"
          className="min-h-11 pt-3 pl-4 text-base leading-[1.3] sm:text-base md:text-base"
        />

        <PromptInputActions className="mt-5 flex w-full items-center justify-between gap-2 px-3 pb-3">
          <div className="flex items-center gap-2">
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPhotoSelect}
            />
            <PromptInputAction tooltip="Add an attachment">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Add photo"
                className="size-9 rounded-full"
                disabled={disabled || isLoading}
                onClick={() => photoInputRef.current?.click()}
              >
                <Plus size={18} />
              </Button>
            </PromptInputAction>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="icon"
              aria-label="Send message"
              disabled={disabled || (!prompt.trim() && !pendingPhoto) || isLoading}
              onClick={onSubmit}
              className="size-9 rounded-full"
            >
              <ArrowUp size={18} />
            </Button>
          </div>
        </PromptInputActions>
        {pendingPhoto ? (
          <div className="flex gap-2 overflow-x-auto px-3 pb-3">
            <div className="relative shrink-0">
              <img
                src={pendingPhoto.previewUrl}
                alt={pendingPhoto.file.name}
                className="size-16 rounded-xl object-cover"
              />
              <Button
                type="button"
                variant="secondary"
                size="icon"
                aria-label="Remove selected photo"
                className="absolute -top-2 -right-2 size-6 rounded-full shadow-sm"
                onClick={onRemovePhoto}
              >
                <X size={14} />
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </PromptInput>
  );
}
