// This is a server component (no "use client" here)
import { Metadata } from 'next';
import { AnalyzeLayoutClient } from "../../../components/analyze-layout-client";

export const metadata: Metadata = {
  title: 'Document Analysis - Releef.ai',
  description: 'Analyze sustainability documents against compliance requirements'
};

export default function AnalyzeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AnalyzeLayoutClient>
      {children}
    </AnalyzeLayoutClient>
  );
}
