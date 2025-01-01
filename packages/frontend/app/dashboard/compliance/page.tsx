import React from "react";
import type { Metadata } from "next";
import PageBreadCrumb from "@/components/page-breadcrumb";

export const metadata: Metadata = {
  title: "Releef — Compliance",
};
export default function Page() {
  return (
    <>
      <PageBreadCrumb title="Compliance" />
      <div>Compliance</div>
    </>
  );
}
