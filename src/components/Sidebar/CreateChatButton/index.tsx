import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/hooks/useDebounce";
import { useCreateChatMutation } from "@/hooks/queries/useChatQueries";
import { useUsersQuery } from "@/hooks/queries/useUserQueries";
import { PlusIcon } from "lucide-react";
import { type FormEvent, useState } from "react";

const CreateChatButton = () => {
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search.trim(), 200);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const createChat = useCreateChatMutation();
  const { data: users = [], isFetching } = useUsersQuery({
    enabled: open,
    search: debouncedSearch,
  });
  const isGroupChat = selectedUserIds.length > 1;
  const canSubmit =
    selectedUserIds.length > 0 && (!isGroupChat || groupName.trim().length > 0);

  const resetForm = () => {
    setGroupName("");
    setSearch("");
    setSelectedUserIds([]);
    createChat.reset();
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      resetForm();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    createChat.mutate(
      isGroupChat
        ? { name: groupName.trim(), memberIds: selectedUserIds }
        : { userId: selectedUserIds[0] },
      {
        onSuccess: () => {
          setOpen(false);
          resetForm();
        },
      },
    );
  };

  const toggleUser = (userId: string) => {
    setSelectedUserIds((current) =>
      current.includes(userId)
        ? current.filter((id) => id !== userId)
        : [...current, userId],
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="mb-4 flex w-full items-center gap-2"
        >
          <PlusIcon className="size-4" />
          <span>New Chat</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create new chat</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            {isGroupChat ? (
              <Field>
                <Label htmlFor="group-name">Group name</Label>
                <Input
                  id="group-name"
                  value={groupName}
                  onChange={(event) => setGroupName(event.target.value)}
                  placeholder="Group name"
                  maxLength={80}
                />
              </Field>
            ) : null}

            <Field>
              <Label htmlFor="user-search">Search users</Label>
              <Input
                id="user-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by email, username, or name"
                autoComplete="off"
              />
            </Field>

            <Field>
              <Label>Users</Label>
              <div className="border-input max-h-64 overflow-y-auto rounded-lg border">
                {isFetching ? (
                  <p className="text-muted-foreground px-3 py-6 text-center text-sm">
                    Searching...
                  </p>
                ) : users.length === 0 ? (
                  <p className="text-muted-foreground px-3 py-6 text-center text-sm">
                    No users found.
                  </p>
                ) : (
                  users.map((user) => {
                    const displayName =
                      user.displayName || user.username || user.email;
                    const isSelected = selectedUserIds.includes(user.id);

                    return (
                      <label
                        key={user.id}
                        className="hover:bg-accent flex cursor-pointer items-center gap-3 px-3 py-2"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleUser(user.id)}
                          className="size-4 accent-primary"
                        />
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt=""
                            className="size-8 rounded-full object-cover"
                          />
                        ) : (
                          <span className="bg-muted flex size-8 items-center justify-center rounded-full text-sm font-medium uppercase">
                            {displayName.slice(0, 1)}
                          </span>
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">
                            {displayName}
                          </span>
                          <span className="text-muted-foreground block truncate text-xs">
                            {user.email}
                          </span>
                        </span>
                      </label>
                    );
                  })
                )}
              </div>
            </Field>
            {createChat.error ? (
              <p className="text-destructive text-sm">
                {createChat.error.message || "Could not create chat."}
              </p>
            ) : null}
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!canSubmit || createChat.isPending}>
              {createChat.isPending
                ? "Creating..."
                : isGroupChat
                  ? "Create group"
                  : "Create chat"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChatButton;
