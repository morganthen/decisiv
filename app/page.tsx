import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function Page() {
  return (
    <div className="relative min-h-dvh bg-background flex items-center justify-center px-10 w-full min-w-0">
      <div className="relative w-full max-w-6xl flex flex-col-reverse md:grid gap-10 md:grid-cols-2 items-center min-w-0">
        <section className="space-y-6 z-1 flex flex-col min-w-0 w-full">
          <div className="space-y-4 text-center md:text-start">
            <h1 className="text-5xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground">
              decisiv
            </h1>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground">
              say goodbye to decision paralysis
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl">
              turn your task list into a focused schedule—with AI-powered
              prioritization and built-in pomodoro sessions.
            </p>
          </div>
          {/* <div className="flex items-center w-full justify-center md:inline">
            <ul className="space-y-1.5 text-xs text-muted-foreground flex gap-2">
              <li>&bull; add tasks in your own words</li>
              <li>&bull; one-click AI prioritisation</li>
              <li>&bull; a clean, focused today view</li>
            </ul>
          </div> */}
          <div className="flex flex-col md:flex-row gap-3 pt-2">
            <Button className="md:w-40 w-full">
              <Link href="/signup">get started</Link>
            </Button>
            <Button variant="outline" className="md:w-32 w-full">
              <Link href="/login">log in</Link>
            </Button>
          </div>
        </section>

        <section
          aria-hidden="true"
          className="absolute md:static bottom-60 md:block z-0 opacity-75 md:opacity-100"
        >
          <Card
            className="md:max-w-lg min-w-96
           mx-auto shadow-sm border-border/60"
          >
            <CardHeader>
              <CardAction className="flex items-center justify-between text-sm">
                <Badge variant="secondary">prioritised</Badge>
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 flex-col max-w-68">
                  <p className="font-medium">prepare client proposal</p>
                  <p className="text-muted-foreground text-xs">
                    deep work block, important for career advancement
                  </p>
                </div>
                <Badge variant="outline">~120min</Badge>
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">inbox + quick replies</p>
                  <p className="text-muted-foreground text-xs">
                    batch low-effort messages
                  </p>
                </div>
                <Badge variant="outline">~30min</Badge>
              </div>
              <div className="flex items-start justify-between gap-4 opacity-80">
                <div>
                  <p className="font-medium">clean up Dropbox</p>
                  <p className="text-muted-foreground text-xs">
                    lowest priority, can be done at any time
                  </p>
                </div>
                <Badge variant="outline">~45min</Badge>
              </div>
            </CardContent>
            <div className="md:hidden absolute top-10 left-0 w-full h-full pointer-events-none bg-linear-to-b from-transparent to-background"></div>
          </Card>
        </section>
      </div>
    </div>
  );
}
