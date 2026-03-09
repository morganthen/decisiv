"use client";

import PrioritizeButton from "@/components/PrioritizeButton";
import TaskInputForm from "@/components/todos/TaskInputForm";
import ToDoList from "@/components/todos/ToDoList";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { addTask, deleteTask, prioritize } from "@/lib/actions";
import { AddTaskState, DeleteTaskState, Task } from "@/lib/types";
import { useActionState, useTransition } from "react";
import { toast } from "sonner";

type ToDoClientShellProps = {
  todos: Task[];
};

export default function ToDoClientShell({ todos }: ToDoClientShellProps) {
  const [isPrioritising, startPrioritising] = useTransition();
  const [addState, addTaskAction, isAdding] = useActionState<AddTaskState>(
    //the below was very annoying. I needed Claude to help me here
    addTask as (state: AddTaskState) => Promise<AddTaskState>,
    null,
  );
  const [deleteState, onDelete, isDeleting] = useActionState<DeleteTaskState>(
    deleteTask as (state: DeleteTaskState) => Promise<DeleteTaskState>,
    null,
  );

  function handlePrioritise() {
    startPrioritising(async () => {
      await prioritize();
      toast("refreshing list");
    });
  }

  const isBusy = isPrioritising || isAdding || isDeleting;

  return (
    <div className="flex flex-col items-center">
      <Card className="flex flex-col items-center justify-center mt-6 px-6 md:w-175 w-96">
        <CardHeader className="md:w-125 text-center mt-9 w-96">
          {todos.length === 0 ? (
            <CardDescription>Start by adding a task!</CardDescription>
          ) : null}
        </CardHeader>
        <ToDoList
          todos={todos}
          deleteState={deleteState}
          onDelete={onDelete}
          isDeleting={isDeleting}
          isPrioritising={isPrioritising}
        />
        <TaskInputForm
          isBusy={isBusy}
          state={addState}
          formAction={addTaskAction}
        />

        <CardFooter>
          {todos.length === 0 ? null : (
            <div>
              <PrioritizeButton
                isBusy={isBusy}
                isPrioritising={isPrioritising}
                handlePrioritise={handlePrioritise}
              />
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
