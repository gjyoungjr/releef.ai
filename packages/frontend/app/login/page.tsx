import * as React from "react";
import LoginForm from "@/components/auth/login-form";
import { Session } from "@releef.ai/types";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function SignUp() {
  const session = (await auth()) as Session;

  if (session) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
