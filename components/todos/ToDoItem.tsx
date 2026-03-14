"use client";

import { Button } from "../ui/button";
import { Item, ItemActions, ItemDescription, ItemTitle } from "../ui/item";
import { Trash } from "lucide-react";

import { Task } from "@/lib/types";
import { toggleDone } from "@/lib/actions";
import { useRef } from "react";
import { Badge } from "../ui/badge";

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

type ToDoItemProps = {
  checked: boolean;
  onToggleChecked: () => void;
  onDelete: (formData: FormData) => void;
  todo: Task;
  isDeleting: boolean;
  isBusy: boolean;
};

export default function ToDoItem({
  checked,
  onToggleChecked,
  onDelete,
  todo,
  isDeleting,
  isBusy,
}: ToDoItemProps) {
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit() {
    formRef.current?.requestSubmit();
    onToggleChecked();
  }

  return (
    <Item className="flex w-full min-w-0">
      <form
        className="contents"
        ref={formRef}
        action={async (formData: FormData) => {
          const checked = formData.get("completed") === "on";
          await toggleDone(todo.id, checked);
        }}
      >
        <input
          disabled={isBusy}
          type="checkbox"
          name="completed"
          className="opacity-50 group-hover:opacity-100 transition-opacity accent-primary mr-4"
          defaultChecked={checked}
          onChange={() => handleSubmit()}
        />
      </form>
      <div className="flex flex-1 flex-col min-w-0">
        <ItemTitle
          className={`${checked ? "line-through text-muted-foreground" : ""} text-wrap `}
        >
          {todo.task}
        </ItemTitle>

        <ItemDescription
          className={`${checked ? "line-through text-muted" : "text-muted-foreground"} text-wrap flex mb-1`}
        >
          {todo.notes ?? null}
        </ItemDescription>
        {todo.estimatedDuration != null && (
          <Badge
            variant={`${checked ? "ghost" : "outline"}`}
            className={`${checked ? "line-through text-muted" : " text-muted-foreground"} min-w-0`}
          >
            ~{todo.estimatedDuration} min
          </Badge>
        )}
      </div>

      <ItemActions className="opacity-50 group-hover:opacity-100 transition-opacity">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={isBusy}>
              <Trash></Trash>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>deleting task</DialogTitle>
              <DialogDescription>
                are you sure? this action cannot be undone, but you can always
                add the task again if you want.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">cancel</Button>
              </DialogClose>
              {/*   //using "contents" here so that the button doesn't get wrapped in an extra div, which would break the styling */}
              <form className="contents">
                <input name="id" type="hidden" value={todo.id} />

                <Button formAction={onDelete} disabled={isDeleting}>
                  {isDeleting ? "deleting..." : "delete"}
                </Button>
              </form>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ItemActions>
    </Item>
  );
}
