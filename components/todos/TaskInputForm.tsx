"use client";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter } from "../ui/card";

import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { AddTaskState } from "@/lib/types";
import { Button } from "../ui/button";
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
      <Card>
        <form action={formAction} ref={formRef}>
          <CardContent>
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
                  disabled={taskValue.trim().length === 0}
                  type="submit"
                  className="bg-primary"
                >
                  <ArrowRight className="text-foreground"></ArrowRight>
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
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
