import PageBreadCrumb from "@/components/page-breadcrumb";
import { getReport } from "./action";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const report = await getReport(id);

  return (
    <>
      <PageBreadCrumb title="Report" />
      <div>Report ID: {id}</div>
    </>
  );
}
