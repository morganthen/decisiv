"use client";

import { CardDescription } from "../ui/card";

import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { AddTaskState } from "@/lib/types";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import { ArrowRight } from "lucide-react";

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
  const [taskValue, setTaskValue] = useState("");

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
    if (state?.success) {
      toast.success("task added", { position: "top-center", duration: 1200 });
      setTaskValue("");
    }
  }, [state]);

  return (
    <div className="w-full min-w-0 flex flex-col justify-center px-8">
      <form action={formAction} ref={formRef}>
        <InputGroup>
          <InputGroupInput
            ref={inputRef}
            name="task"
            required
            placeholder="add a task"
            disabled={isBusy}
            className={isBusy ? "bg-card" : ""}
            value={taskValue}
            onChange={(e) => setTaskValue(e.target.value)}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              disabled={taskValue.trim().length === 0 || isBusy}
              type="submit"
              className="bg-primary"
            >
              <ArrowRight className="text-foreground"></ArrowRight>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        {state && state.success === false && state.error ? (
          <CardDescription className="flex justify-center mt-4">
            <p>there&apos;s been an error</p>
          </CardDescription>
        ) : null}
      </form>
    </div>
  );
}
