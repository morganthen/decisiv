"use client";

import PrioritizeButton from "@/components/PrioritizeButton";
import TaskInputForm from "@/components/todos/TaskInputForm";
import ToDoList from "@/components/todos/ToDoList";
import { Card, CardFooter } from "@/components/ui/card";
import { addTask, deleteTask } from "@/lib/actions";
import { AddTaskState, DeleteTaskState, Task } from "@/lib/types";
import { useActionState, useTransition } from "react";

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

  const isBusy = isPrioritising || isAdding || isDeleting;

  return (
    <div className="flex flex-col items-center">
      <Card className="flex flex-col items-center justify-center mt-6 px-6 md:w-175 w-96">
        <h1 className="text-3xl">To Do</h1>
        {todos.length === 0 ? <p>Start by adding a task!</p> : null}
        <ToDoList
          todos={todos}
          deleteState={deleteState}
          onDelete={onDelete}
          isDeleting={isDeleting}
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
                startPrioritising={startPrioritising}
              />
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
