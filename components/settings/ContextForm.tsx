import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/auth/supabase";
import ContextFormClient from "./ContextFormClient";

export default async function ContextForm() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: setting } = await supabase
    .from("settings")
    .select("user_context")
    .eq("user_id", user?.id)
    .maybeSingle();

  const initialContext = setting?.user_context ?? "";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile context</CardTitle>
        <CardDescription>
          Tell us a little about yourself. This will be used to give the
          assistant better suggestions and to prioritise your tasks more
          intelligently. Keep it short — a few sentences is perfect.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Label className="mb-2">About you</Label>
        <ContextFormClient initialContext={initialContext} />
      </CardContent>
    </Card>
  );
}
