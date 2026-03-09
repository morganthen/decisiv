import { cache } from "react";
import { createClient } from "./auth/supabase";
import { Task } from "./types";

const getSupabaseWithUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("not authenticated");
  }

  return { supabase, user };
});

export async function getToDos(): Promise<Task[]> {
  const { supabase, user } = await getSupabaseWithUser();
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", user.id)
    .order("priority_score", { nullsFirst: false, ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("error in retrieving to dos");
    throw new Error("theres been a problem retrieving to dos");
  }

  return (data ?? []) as Task[];
}
