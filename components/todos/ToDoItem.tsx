"use client";

import { Button } from "../ui/button";
import { Item, ItemActions, ItemDescription, ItemTitle } from "../ui/item";
import { Trash } from "lucide-react";

import { Task } from "@/lib/types";
import { toggleDone } from "@/lib/actions";
import { useRef, useState } from "react";

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
      <Item className="grid grid-cols-5 md:w-105 max-w-xl justify-between lg:w-145 w-90">
        <form
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
        <div className="flex flex-col col-span-3 col-start-2 ">
          <ItemTitle className={checked ? "line-through" : ""}>
            {todo.task}
          </ItemTitle>
          <ItemDescription className="flex mt-1 break-normal text-muted-foreground items-center">
            {todo.notes ?? null}
            {todo.estimatedDuration != null && (
              <span className="ml-2 text-xs text-muted-foreground">
                ~{todo.estimatedDuration} min
              </span>
            )}
          </ItemDescription>
        </div>
        <ItemActions className="col-span-1 col-start-5 justify-self-end opacity-50 group-hover:opacity-100 transition-opacity">
          <form>
            <input name="id" type="hidden" value={todo.id} />

            <Button formAction={onDelete} variant="destructive" size="sm">
              <Trash></Trash>
            </Button>
          </form>
        </ItemActions>
      </Item>
    </div>
  );
}
