import { auth } from "@/auth";
import { Session, Report } from "@releef.ai/types";

const CORE_API_URL = process.env.CORE_API_URL;

export const getReport = async (id: string) => {
  const session = (await auth()) as Session;

  const response = await fetch(
    `${CORE_API_URL}/report/?id=${id}&userId=${session.user.id}`,
    {
      cache: "no-store",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get reports");
  }

  const data = await response.json();
  return data as Report;
};
