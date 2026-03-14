"use server";

import { redirect } from "next/navigation";
import { adminCreateClient, createClient } from "./supabase";

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
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

function isAdmin(user: any) {
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim());
  return Boolean(user?.email && admins.includes(user.email));
}

export async function deleteUser(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
    return;
  }

  if (user.id !== id && !isAdmin(user)) {
    throw new Error("unauthorised");
  }

  const adminSupabase = await adminCreateClient();

  // Remove dependent rows in `public.settings` that reference this user.
  // This avoids FK constraint failures when deleting the auth user.
  try {
    const tables = ["todos", "work_sessions", "settings"];

    for (const table of tables) {
      const { error: depErr } = await adminSupabase
        .from(table)
        .delete()
        .eq("user_id", id);

      if (depErr) {
        console.error(`failed to delete dependents in ${table}:`, depErr);
        throw new Error(
          depErr.message || `failed to delete dependents in ${table}`,
        );
      }
    }
  } catch (err) {
    console.error("error deleting dependents:", err);
    throw err;
  }

  const { error: deleteError, data: deleteData } =
    await adminSupabase.auth.admin.deleteUser(id as string);

  if (deleteError) {
    console.error("deleteUser error:", deleteError);
    throw new Error(deleteError.message || "failed to delete user");
  }

  console.log("deleteUser result:", deleteData);

  console.log({
    action: "delete user",
    performedBy: user.id,
    target: id,
    at: new Date().toISOString(),
  });

  // If the user deleted their own account, sign them out so their session is cleared.
  if (user.id === id) {
    await supabase.auth.signOut();
    redirect("/login");
  }

  redirect("/");
}
