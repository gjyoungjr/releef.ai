"use client";

import React from "react";
import { Ellipsis, ShieldCheck, Trash2 } from "lucide-react";
import { Report } from "@releef.ai/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
export const ReportActions = ({ report }: { report: Report }) => {
  const router = useRouter();
  const reportId = report.SK.split("#")[1];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Ellipsis className="w-4 h-4 cursor-pointer" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-55">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/report/${reportId}`)}
          >
            <ShieldCheck />
            Verify compliance
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="text-destructive">
            <Trash2 />
            Move to trash
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
