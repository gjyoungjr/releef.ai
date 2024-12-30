"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { getMessageFromCode } from "@/lib/utils";
import { authenticate } from "@/app/login/actions";
import { Loader } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [result, dispatch] = useFormState(authenticate, undefined);
  const { pending } = useFormStatus();

  console.log("pending", pending);

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
            Welcome back
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter your email below to log in
          </p>
        </div>
        <form action={dispatch}>
          <div className="mb-4 mt-8">
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
              type="password    "
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>
          <Button className="w-full" disabled={false}>
            Log in
          </Button>
        </form>
        <div className="flex items-center justify-center mt-5">
          <Link
            href="/signup"
            className="flex flex-row gap-1 text-muted-foreground text-sm"
          >
            No account?{" "}
            <div className="font-semibold underline text-muted-foreground text-sm">
              Sign Up
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
