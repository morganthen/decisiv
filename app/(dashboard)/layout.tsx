import { Button } from "@/components/ui/button";
import { signout } from "@/lib/auth/actions";
import { createClient } from "@/lib/auth/supabase";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div className="min-h-dvh bg-background flex flex-col ">
      <header className="bg-card grid md:grid-cols-3 grid-cols-2 px-6 py-4 border-b  items-center justify-between">
        <span className="text-sm text-muted-foreground hidden md:inline">
          {user?.email}
        </span>
        <div className="text-primary justify-self-start md:justify-self-center">
          <p>
            <span className="hidden md:inline">welcome to </span>decisiv
          </p>
        </div>
        <div className="justify-self-end">
          {/* <ModeToggle /> */}
          <form>
            <Button formAction={signout} variant="ghost" size="sm">
              log out
            </Button>
          </form>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center">
        {children}
      </main>
    </div>
  );
}
