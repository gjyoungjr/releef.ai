import ChatV2 from "@/components/chat-v2";
import PageBreadCrumb from "@/components/page-breadcrumb";

export default async function Page() {
  return (
    <>
      <PageBreadCrumb title="Ask AI" />
      <ChatV2 />
    </>
  );
}
