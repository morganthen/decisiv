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
import { signUp } from "@/lib/auth/actions";
import Link from "next/link";
import { useActionState, useState } from "react";

export default function SignUp() {
  const [state, formAction, isPending] = useActionState(signUp, null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  function validatePassword() {
    if (password !== confirmPassword) {
      return false;
    } else {
      return true;
    }
  }

  return (
    <div className="h-dvh bg-background flex flex-col justify-center relative">
      <Card className="mx-10">
        <CardHeader>
          <CardTitle>Sign up for an account</CardTitle>
          <CardDescription>
            Enter your email and a password below to sign up
          </CardDescription>
          <CardAction>
            <Button variant="link">
              <Link href="/login">Back to Log In</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form
            action={
              confirmPasswordTouched && !validatePassword()
                ? () => {}
                : formAction
            }
          >
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
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  name="password"
                  id="password"
                  type="password"
                  onFocus={() => setConfirmPasswordTouched(false)}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
                <div className="flex items-center">
                  <Label htmlFor="password">Confirm Password</Label>
                </div>
                <Input
                  name="confirm-password"
                  id="confirm-password"
                  type="password"
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  onBlur={() => setConfirmPasswordTouched(true)}
                />
              </div>
            </div>
            {state?.error && <p>{state.error}</p>}
            {confirmPasswordTouched && !validatePassword() && (
              <p>Passwords do not match</p>
            )}
            <Button type="submit" className="w-full mt-6">
              {isPending ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2"></CardFooter>
      </Card>
    </div>
  );
}
