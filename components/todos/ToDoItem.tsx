"use client";

import { Button } from "../ui/button";
import { Item, ItemActions, ItemDescription, ItemTitle } from "../ui/item";
import { Trash } from "lucide-react";

import { Task } from "@/lib/types";
import { Checkbox } from "../ui/checkbox";

type ToDoItemProps = {
  onDelete: (formData: FormData) => void;
  todo: Task;
};

export default function ToDoItem({ onDelete, todo }: ToDoItemProps) {
  return (
    <div className="group">
      <Item className="grid grid-cols-5 md:w-105 max-w-xl justify-between lg:w-145 w-90">
        <Checkbox className="col-span-1 col-start-1 opacity-50 group-hover:opacity-100 transition-opacity m-0 p-0" />
        <div className="flex flex-col col-span-3 col-start-2">
          <ItemTitle>{todo.task}</ItemTitle>
          <ItemDescription className="flex mt-1 break-normal text-muted-foreground">
            {todo.notes ?? null}
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
