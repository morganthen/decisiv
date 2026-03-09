import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="h-dvh bg-background flex flex-col items-center justify-center">
      <div className="bg-card p-4 rounded-2xl flex flex-col items-center justify-center">
        <h1 className="text-foreground text-lg m-8">welcome to decisive</h1>
        <div className="flex m-8 space-x-3">
          <Button className="w-48">
            <Link href="/login">log In</Link>
          </Button>
          <Button className="w-48" variant="outline">
            <Link href="/signup">sign up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
