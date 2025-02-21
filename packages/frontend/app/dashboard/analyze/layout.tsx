"use client";

import { PageHeader } from "@/components/page-header";

export default function AnalyzeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeader
        title="Document Analysis"
        description="Analyze sustainability documents against compliance requirements"
      />
      {children}
    </>
  );
}
