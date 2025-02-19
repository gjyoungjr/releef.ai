import React from "react";
import type { Metadata } from "next";
import { PageBreadCrumb } from "@/components/page-breadcrumb";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
export const metadata: Metadata = {
  title: "Releef — Compliance",
};
export default function Page() {
  return (
    <>
      <PageBreadCrumb title="Frameworks" />
      <Card className="w-[270px] shadow-xs p-0">
        <CardHeader className="flex flex-row gap-3 p-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/assets/csrd.webp" alt="csrd" sizes="" />
          </Avatar>
          <CardTitle className="text-sm">CSRD</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs">
            Corporate Sustainability Reporting Directive datapoint disclosures
            require companies to report detailed, standardized sustainability
            information on ESG factors to enhance transparency and comparability
            for stakeholders.
          </p>
        </CardContent>
        <CardFooter className="p-4 mt-0">
          <Button variant={"outline"} size={"sm"}>
            View datapoints
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
