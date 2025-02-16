import PageBreadCrumb from "@/components/page-breadcrumb";
import { Chat } from "@/components/chat";
import { generateId } from "ai";

export default async function Page() {
  return (
    <div>
      <PageBreadCrumb title="Ask AI" />
      <Chat id={generateId()} />
    </div>
  );
}
