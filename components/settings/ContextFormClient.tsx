"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ContextFormClient({
  initialContext,
}: {
  initialContext?: string;
}) {
  const [value, setValue] = useState(initialContext ?? "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/save-context", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ context: value }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "save failed");

      toast.success("Context saved", {
        position: "top-center",
        duration: 1200,
      });
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message ?? "Could not save context");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        name="context"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={6}
      />
      <div className="w-full flex mt-4 items-center">
        <div className="flex-1 text-sm text-muted-foreground">
          Your context is stored and will be included when you ask the assistant
          for prioritisation.
        </div>
        <div>
          <Button type="submit" disabled={loading} className="min-w-32">
            {loading ? "saving…" : "save context"}
          </Button>
        </div>
      </div>
    </form>
  );
}
