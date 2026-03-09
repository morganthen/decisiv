"use server";

import { redirect } from "next/navigation";
import { createClient } from "./supabase";

export async function login(
  prevState: unknown,
  formData: FormData,
): Promise<{ error: string } | void> {
  const supabase = await createClient();

  if (!formData.get("email")) return { error: "Email is required" };
  if (!formData.get("password")) return { error: "Password is required" };

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/todo");
}

export async function signUp(
  prevState: unknown,
  formData: FormData,
): Promise<{ error: string } | void> {
  const supabase = await createClient();
  if (!formData.get("email")) return { error: "Email is required" };
  if (!formData.get("password")) return { error: "Password is required" };

  const { error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/login?message=check-email");
}

export async function signout() {
  console.log("sign out clicked");
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
