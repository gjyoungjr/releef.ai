"use client";

import { PageHeader } from "./page-header";

export function AnalyzeLayoutClient({
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