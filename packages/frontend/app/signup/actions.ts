"use server";

import { signIn } from "@/auth";
import { ResultCode, getStringFromBuffer } from "@/lib/utils";
import { z } from "zod";
import { getUser } from "../login/actions";
import { AuthError } from "next-auth";
import { User } from "@releef.ai/types";

const CORE_API_URL = process.env.CORE_API_URL;

async function saveUser(
  user: Pick<User, "id" | "name" | "email" | "hashedPassword" | "salt">
) {
  const response = await fetch(`${CORE_API_URL}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...user,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to save user");
  }
}
export async function createUser(
  email: string,
  name: string,
  hashedPassword: string,
  salt: string
) {
  const existingUser = await getUser(email);

  if (existingUser) {
    return {
      type: "error",
      resultCode: ResultCode.UserAlreadyExists,
    };
  } else {
    const user = {
      id: crypto.randomUUID(),
      email,
      hashedPassword,
      salt,
      name,
    };

    await saveUser(user);

    return {
      type: "success",
      resultCode: ResultCode.UserCreated,
    };
  }
}

interface Result {
  type: string;
  resultCode: ResultCode;
}

export async function signup(
  _prevState: Result | undefined,
  formData: FormData
): Promise<Result | undefined> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  const parsedCredentials = z
    .object({
      email: z.string().email(),
      password: z.string().min(6),
    })
    .safeParse({
      email,
      password,
    });

  if (parsedCredentials.success) {
    const salt = crypto.randomUUID();

    const encoder = new TextEncoder();
    const saltedPassword = encoder.encode(password + salt);
    const hashedPasswordBuffer = await crypto.subtle.digest(
      "SHA-256",
      saltedPassword
    );
    const hashedPassword = getStringFromBuffer(hashedPasswordBuffer);

    try {
      const result = await createUser(email, fullName, hashedPassword, salt);

      if (result.resultCode === ResultCode.UserCreated) {
        await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
      }

      return result;
    } catch (error) {
      console.error("Error signing up:", error);
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return {
              type: "error",
              resultCode: ResultCode.InvalidCredentials,
            };
          default:
            return {
              type: "error",
              resultCode: ResultCode.UnknownError,
            };
        }
      } else {
        return {
          type: "error",
          resultCode: ResultCode.UnknownError,
        };
      }
    }
  } else {
    return {
      type: "error",
      resultCode: ResultCode.InvalidCredentials,
    };
  }
}
