import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { signout } from "@/lib/auth/actions";
import { createClient } from "@/lib/auth/supabase";
import { Menu } from "lucide-react";
import Link from "next/link";

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
    <div className="min-h-dvh bg-background flex flex-col relative">
      <header className="bg-card grid md:grid-cols-3 grid-cols-2 px-6 py-4 border-b  items-center justify-between">
        <span className="text-sm text-muted-foreground hidden md:inline">
          {user?.email}
        </span>
        <div className="text-primary justify-self-start md:justify-self-center">
          <p>
            <span className="hidden md:inline">welcome to </span>
            <Link href="/todo">decisiv</Link>
          </p>
        </div>
        <div className="justify-self-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Menu></Menu>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <nav>
                  <DropdownMenuItem asChild>
                    <Link href="/todo">main</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">settings</Link>
                  </DropdownMenuItem>

                  <form className="m-0">
                    <DropdownMenuItem asChild>
                      <button
                        formAction={signout}
                        className="w-full text-left "
                        type="submit"
                      >
                        log out
                      </button>
                    </DropdownMenuItem>
                  </form>
                </nav>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center">
        {children}
      </main>
    </div>
  );
}
