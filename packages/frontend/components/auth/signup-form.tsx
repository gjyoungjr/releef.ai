"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { signup } from "@/app/signup/actions";
import { getMessageFromCode } from "@/lib/utils";
import { toast } from "sonner";

export default function SignUpForm() {
  const router = useRouter();
  const [result, dispatch] = useFormState(signup, undefined);

  React.useEffect(() => {
    if (result) {
      if (result.type === "error") {
        toast.error(getMessageFromCode(result.resultCode));
      } else {
        toast.success(getMessageFromCode(result.resultCode));
        router.refresh();
      }
    }
  }, [result, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className={cn("w-[400px] p-6")}>
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create your account
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter your email below to create an account
          </p>
        </div>
        <form action={dispatch}>
          <div className="mt-8">
            <Label className="sr-only" htmlFor="fullName">
              Full Name
            </Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="Jane Doe"
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>
          <div className="mb-4 mt-3">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
            />
          </div>
          <div className="mb-4 mt-3">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              placeholder="password"
              type="password"
              autoCapitalize="none"
              autoCorrect="off"
              required
              minLength={6}
            />
          </div>
          <Button className="w-full mb-4">
            {/* {isAuthenticating && (
              <SpinnerIcon className="mr-2 h-5 w-5 animate-spin" />
            )} */}
            Sign up
          </Button>
        </form>
        <div className="flex items-center justify-center mt-5">
          <Link
            href="/login"
            className="flex flex-row gap-1 text-muted-foreground text-sm"
          >
            Already have an account?{" "}
            <div className="font-semibold underline text-muted-foreground text-sm">
              Log In
            </div>
          </Link>
        </div>

        <Separator className="my-6" />

        <p className="text-muted-foreground mt-5 px-8 text-center text-sm">
          By signing up, you agree to our{" "}
          <Link
            href="/terms"
            className="hover:text-primary underline underline-offset-4 font-semibold"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="hover:text-primary underline underline-offset-4 font-semibold"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
