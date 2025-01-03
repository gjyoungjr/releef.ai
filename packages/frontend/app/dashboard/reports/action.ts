import { auth } from "@/auth";
import { Session, Report } from "@releef.ai/types";
const CORE_API_URL = process.env.CORE_API_URL;

export const listReports = async () => {
  const session = (await auth()) as Session;
  console.log("fetching reports...");

  const response = await fetch(
    `${CORE_API_URL}/report?userId=${session.user.id}`,
    {
      next: {
        tags: ["reports"],
      },
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get reports");
  }

  const data = await response.json();
  console.log(data);

  return data.items as Report[];
};
