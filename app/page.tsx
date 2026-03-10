import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-dvh bg-background flex items-center justify-center px-10">
      <div className="w-full max-w-6xl grid gap-10 md:grid-cols-2 items-center">
        <section className="space-y-6">
          <Badge variant="outline" className="rounded-full px-3 py-1">
            decisiv
          </Badge>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground">
              turn plain text into prioritised schedules
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl">
              drop in your tasks as a simple list and let decisiv sort and
              surface what actually matters right now.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button className="sm:w-40 w-full">
              <Link href="/signup">get started</Link>
            </Button>
            <Button variant="outline" className="sm:w-32 w-full">
              <Link href="/login">log in</Link>
            </Button>
          </div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li>– add tasks in your own words</li>
            <li>– one-click AI prioritisation</li>
            <li>– a clean, focused today view</li>
          </ul>
        </section>

        <section aria-hidden="true" className="hidden md:block">
          <Card className="max-w-md mx-auto shadow-sm border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">today</span>
                <Badge variant="secondary">prioritised</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">prepare client proposal</p>
                  <p className="text-muted-foreground text-xs">
                    deep work block · 60 min
                  </p>
                </div>
                <Badge variant="outline">now</Badge>
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">inbox + quick replies</p>
                  <p className="text-muted-foreground text-xs">
                    batch low-effort messages
                  </p>
                </div>
                <Badge variant="outline">next</Badge>
              </div>
              <div className="flex items-start justify-between gap-4 opacity-80">
                <div>
                  <p className="font-medium">plan tomorrow</p>
                  <p className="text-muted-foreground text-xs">
                    capture tasks to keep clear
                  </p>
                </div>
                <Badge variant="outline">later</Badge>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
