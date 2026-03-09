// app/api/test-priorities/route.ts
import { NextResponse } from "next/server";
import { fetchPriorities } from "@/lib/helpers";
import { Task } from "@/lib/types";
import { createClient } from "@/lib/auth/supabase";

export async function GET() {
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

  const result = await fetchPriorities({ todos });

  // Log to server console
  console.log("LLM Response:", result);

  // Return as JSON for browser inspection
  return NextResponse.json({ result });
}
