"use client";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter } from "../ui/card";

import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { AddTaskState } from "@/lib/types";

type TaskInputFormProps = {
  state: AddTaskState;
  formAction: (formData: FormData) => void;
  isBusy: boolean;
};

export default function TaskInputForm({
  state,
  formAction,
  isBusy,
}: TaskInputFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.success === true) {
      formRef.current?.reset();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    }
  }, [state]);

  useEffect(() => {
    if (state && state.success === false && state.error)
      toast.error(state.error, {
        position: "top-center",
        duration: 1200,
      });
    if (state?.success)
      toast.success("task added", { position: "top-center", duration: 1200 });
  }, [state]);

  return (
    <div className="md:w-105 lg:w-145 w-80 flex flex-col justify-center">
      <Card>
        <form action={formAction} ref={formRef}>
          <CardContent>
            <Input
              ref={inputRef}
              name="task"
              required
              placeholder="add a task"
              disabled={isBusy}
              className={isBusy ? "bg-card" : ""}
            />
          </CardContent>
          <CardFooter className="flex justify-center mt-4">
            {state && state.success === false && state.error ? (
              <CardDescription>
                <p>there&apos; been an error</p>
              </CardDescription>
            ) : null}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
