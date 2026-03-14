import { NextResponse } from "next/server";
import { createClient } from "@/lib/auth/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const context = String(body.context ?? "").trim();

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user)
      return NextResponse.json({ error: "not authenticated" }, { status: 401 });

    const { data, error } = await supabase
      .from("settings")
      .upsert([{ user_id: user.id, user_context: context }], {
        onConflict: "user_id",
      })
      .select();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? String(err) },
      { status: 500 },
    );
  }
}
