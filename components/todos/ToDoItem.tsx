"use client";

import { Button } from "../ui/button";
import { Item, ItemActions, ItemDescription, ItemTitle } from "../ui/item";
import { Trash } from "lucide-react";

import { Task } from "@/lib/types";
import { toggleDone } from "@/lib/actions";
import { useRef, useState } from "react";
import { CardAction } from "../ui/card";
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
  onDelete: (formData: FormData) => void;
  todo: Task;
};

export default function ToDoItem({ onDelete, todo }: ToDoItemProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [checked, setChecked] = useState(todo.completed);

  function handleSubmit() {
    formRef.current?.requestSubmit();
    setChecked((prev) => !prev);
  }

  return (
    <div className="group">
      <Item className="grid grid-cols-6 md:w-105 min-w-100 justify-between lg:w-145 w-90">
        <form
          className="contents"
          ref={formRef}
          action={async (formData: FormData) => {
            const checked = formData.get("completed") === "on";
            await toggleDone(todo.id, checked);
          }}
        >
          <input
            type="checkbox"
            name="completed"
            className="col-span-1 col-start-1 opacity-50 group-hover:opacity-100 transition-opacity accent-primary m-0 p-0"
            defaultChecked={todo.completed}
            onChange={() => handleSubmit()}
          />
        </form>
        <div className="flex flex-col col-span-4 col-start-2 pr-4">
          <ItemTitle
            className={checked ? "line-through text-muted-foreground" : ""}
          >
            {todo.task}
          </ItemTitle>
          <ItemDescription
            className={`${checked ? "line-through text-muted" : "text-muted-foreground"} flex mt-1 break-normal justify-between items-center`}
          >
            {todo.notes ?? null}
          </ItemDescription>
        </div>
        <div className="col-span-1 col-start-6">
          {todo.estimatedDuration != null && (
            <CardAction className="ml-2 text-xs justify-se">
              <Badge
                variant={`${checked ? "ghost" : "outline"}`}
                className={`${checked ? "line-through text-muted" : " text-muted-foreground"} `}
              >
                ~{todo.estimatedDuration} min
              </Badge>
            </CardAction>
          )}
        </div>
        <ItemActions className="col-span-1 col-start-7 justify-self-end opacity-50 group-hover:opacity-100 transition-opacity">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
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
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                {/*   //using "contents" here so that the button doesn't get wrapped in an extra div, which would break the styling */}
                <form className="contents">
                  <input name="id" type="hidden" value={todo.id} />

                  <Button formAction={onDelete}>Delete</Button>
                </form>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </ItemActions>
      </Item>
    </div>
  );
}
