"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/auth/actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useActionState } from "react";

function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, null);
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <div className="h-dvh bg-background flex flex-col justify-center items-center">
      <Card className="mx-10 md:w-125 w-100">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email and password below to login to your account
          </CardDescription>
          <CardAction>
            <Button variant="link">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  name="email"
                />
              </div>
              <div className="grid gap-2">
                {/* <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                  Forgot your password?
                  </a>
                  </div> */}
                <Input id="password" type="password" required name="password" />
              </div>
            </div>
            <CardFooter className="flex-col gap-2 mt-6">
              {state?.error && <p>{state.error}</p>}
              {message === "check-email" ? (
                <p>Check email for verification before logging in</p>
              ) : null}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
