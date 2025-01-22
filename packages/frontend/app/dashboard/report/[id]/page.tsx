import PageBreadCrumb from "@/components/page-breadcrumb";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return (
    <>
      <PageBreadCrumb title="Report" />
      <div>Report ID: {id}</div>
    </>
  );
}
