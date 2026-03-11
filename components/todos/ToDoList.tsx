"use client";
import { useEffect } from "react";
import ToDoItem from "./ToDoItem";
import { DeleteTaskState, Task } from "@/lib/types";
import { toast } from "sonner";

type ToDoListProps = {
  deleteState: DeleteTaskState;
  todos: Task[];
  onDelete: (formData: FormData) => void;
  isDeleting: boolean;
  isPrioritising: boolean;
};

export default function ToDoList({
  deleteState,
  onDelete,
  isDeleting,
  todos,
  isPrioritising,
}: ToDoListProps) {
  useEffect(() => {
    if (isDeleting === true) {
      console.log("deleting...");
      toast("deleting...", { position: "top-center", duration: 1200 });
    }
  }, [isDeleting]);

  useEffect(() => {
    if (deleteState && deleteState.success === false && deleteState.error) {
      toast("there was a problem deleting task");
    }
    if (deleteState?.success) {
      console.log("task deleted");
      toast.success("task deleted", { position: "top-center", duration: 1200 });
    }
  }, [deleteState]);

  return (
    <div className="relative flex flex-col items-center w-full">
      {todos.map((todo) => (
        <ToDoItem onDelete={onDelete} key={todo.id} todo={todo} />
      ))}

      {isPrioritising && (
        <div className="absolute inset-0 bg-background/20 backdrop-blur-sm rounded-l-lg animate-pulse" />
      )}
    </div>
  );
}
