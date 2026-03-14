"use client";
import { startTransition, useActionState, useEffect } from "react";
import ToDoItem from "./ToDoItem";
import { DeleteTaskState, Task } from "@/lib/types";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { clearCompletedTasks } from "@/lib/actions";

type ToDoListProps = {
  deleteState: DeleteTaskState;
  todos: Task[];
  onDelete: (formData: FormData) => void;
  isDeleting: boolean;
  isPrioritising: boolean;
  isBusy: boolean;
  checkedMap: Record<string | number, boolean>;
  handleToggleChecked: (todoId: string | number) => void;
};

export default function ToDoList({
  deleteState,
  onDelete,
  isDeleting,
  todos,
  isBusy,
  checkedMap,
  handleToggleChecked,
}: ToDoListProps) {
  const [, clearAll, isClearing] = useActionState(
    clearCompletedTasks as () => Promise<{ success: boolean; error?: string }>,
    null,
  );

  useEffect(() => {
    if (isClearing === true) {
      toast("clearing tasks...", { position: "top-center", duration: 1200 });
    }
  }, [isClearing]);

  useEffect(() => {
    if (isDeleting === true) {
      toast("deleting...", { position: "top-center", duration: 1200 });
    }
  }, [isDeleting]);

  useEffect(() => {
    if (deleteState && deleteState.success === false && deleteState.error) {
      toast("there was a problem deleting task");
    }
    if (deleteState?.success) {
      toast.success("task deleted", { position: "top-center", duration: 1200 });
    }
  }, [deleteState]);

  const allCompleted =
    todos.length > 0 && todos.every((todo) => checkedMap[todo.id]);

  return (
    <div className="flex flex-col items-center min-w-0 w-full px-6">
      {todos.map((todo) => (
        <ToDoItem
          isBusy={isBusy}
          isDeleting={isDeleting}
          onDelete={onDelete}
          key={todo.id}
          todo={todo}
          checked={checkedMap[todo.id]}
          onToggleChecked={() => handleToggleChecked(todo.id)}
        />
      ))}
      {allCompleted && !isBusy && (
        <div className="flex flex-col items-center my-4">
          <p className="text-sm text-muted-foreground mb-4">great work!</p>
          <Button
            disabled={isBusy}
            onClick={() => {
              startTransition(() => {
                clearAll();
              });
            }}
          >
            clear all tasks
          </Button>
        </div>
      )}
    </div>
  );
}
