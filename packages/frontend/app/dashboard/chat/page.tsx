import { PageBreadCrumb } from "@/components/page-breadcrumb";
import { Chat } from "@/components/chat";
import { generateId } from "ai";
import { Session } from "@releef.ai/types";
import { auth } from "@/auth";

export default async function Page() {
  const session = (await auth()) as Session;

  return (
    <div>
      <PageBreadCrumb title="Ask AI" />
      <Chat id={generateId()} user={session.user} />
    </div>
  );
}
