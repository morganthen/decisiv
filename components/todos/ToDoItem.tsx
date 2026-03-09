"use client";

import { Button } from "../ui/button";
import { Item, ItemActions, ItemDescription, ItemTitle } from "../ui/item";
import { Trash } from "lucide-react";

import { Task } from "@/lib/types";

type ToDoItemProps = {
  onDelete: (formData: FormData) => void;
  todo: Task;
};

export default function ToDoItem({ onDelete, todo }: ToDoItemProps) {
  return (
    <div className="group">
      <Item className="grid grid-cols-4 md:w-175 max-w-xl justify-between w-80">
        <div className="flex flex-col col-span-3 col-start-1">
          <ItemTitle>{todo.task}</ItemTitle>
          <ItemDescription className="flex mt-1 break-normal text-muted-foreground">
            {todo.notes ?? null}
          </ItemDescription>
        </div>
        <ItemActions className="col-span-1 col-start-4 justify-self-end opacity-50 group-hover:opacity-100 transition-opacity">
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
