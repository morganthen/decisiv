"use client";

import PrioritizeButton from "@/components/PrioritizeButton";
import TaskInputForm from "@/components/todos/TaskInputForm";
import ToDoList from "@/components/todos/ToDoList";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { addTask, deleteTask, prioritize } from "@/lib/actions";
import { AddTaskState, DeleteTaskState, Task } from "@/lib/types";
import { useActionState, useTransition } from "react";
import { toast } from "sonner";
import Timer from "../pomodoro/Timer";

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
    <div className="flex md:flex-row-reverse md:gap-4 lg:gap-20 items-center flex-col">
      <Timer />
      <Card className="flex flex-col items-center justify-center lg:w-175 md:w-125 w-96 ">
        {todos.length === 0 ? (
          <CardHeader className="md:w-125 text-center mt-9 w-96">
            <CardDescription>add a few tasks to begin...</CardDescription>
          </CardHeader>
        ) : null}
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
          {todos.length < 2 ? null : (
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
