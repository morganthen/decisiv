"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "./auth/supabase";
import { fetchPriorities } from "./helpers";
import { AddTaskState, DeleteTaskState, Priorities, Task } from "./types";

export async function addTask(
  prevState: AddTaskState,
  formData: FormData,
): Promise<AddTaskState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "not authenticated" };

  const { error } = await supabase.from("todos").insert({
    user_id: user.id,
    task: formData.get("task") as string,
  });

  if (error) {
    console.error("we encountered a problem adding task");
    return { success: false, error: "a problem occured adding task" };
  }
  revalidatePath("/todo");
  return { success: true };
}

export async function deleteTask(
  prevState: DeleteTaskState,
  formData: FormData,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "not authenticated" };

  const { error } = await supabase
    .from("todos")
    .delete()
    .eq("id", formData.get("id") as string);

  if (error) {
    console.error("we encountered a problem deleting task");
    return { success: false, error: "a problem occured deleting task" };
  }
  revalidatePath("/todo");
  return { success: true };
}

export async function prioritize() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "not authenticated" };

  const response = await supabase
    .from("todos")
    .select("id, task")
    .eq("user_id", user.id);

  const todos = (response.data ?? []) as Pick<Task, "id" | "task">[];

  if (!todos) return { success: false, error: "No todos found" };

  const llmResult = await fetchPriorities({ todos });

  let cleaned = llmResult.trim();
  // Remove code block markers if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/```[a-z]*\n?/i, "").replace(/```$/, "");
  }

  let priorities: Priorities;
  try {
    priorities = JSON.parse(cleaned);
  } catch (e) {
    console.error("JSON parse error", e);
    return { success: false, error: "AI did not return valid JSON" };
  }

  await Promise.all(
    Object.entries(priorities).map(([id, { score, explanation }]) =>
      supabase
        .from("todos")
        .update({ priority_score: score, notes: explanation })
        .eq("id", id),
    ),
  );

  revalidatePath("/todo");
  return { success: true };
}

export async function logSessionDuration(duration: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "not authenticated" };

  const { error } = await supabase.from("work_sessions").insert({
    user_id: user.id,
    duration,
  });

  if (error) {
    console.error("we encountered a problem logging session duration");
    return {
      success: false,
      error: "a problem occured logging session duration",
    };
  }
  revalidatePath("/todo");
  return { success: true };
}

export async function toggleDone(taskId: string, completed: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "not authenticated" };

  const { error } = await supabase
    .from("todos")
    .update({ completed: completed })
    .eq("id", taskId);

  if (error) {
    console.error("we encountered a problem toggling task done");
    return {
      success: false,
      error: "a problem occured marking task as done",
    };
  }
  revalidatePath("/todo");
  return { success: true };
}
