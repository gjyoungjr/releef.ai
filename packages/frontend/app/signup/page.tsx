import * as React from "react";
import SignUpForm from "@/components/auth/signup-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Session } from "@rekha-ai/types";

export default async function SignUp() {
  const session = (await auth()) as Session;

  if (session) {
    redirect("/dashboard");
  }
  return <SignUpForm />;
}
