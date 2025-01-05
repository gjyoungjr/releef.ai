import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileTextIcon } from "lucide-react";
import { listReports } from "./action";
import PageBreadCrumb from "@/components/page-breadcrumb";
import Upload from "@/components/test-upload";
import { auth } from "@/auth";
import { Session } from "@releef.ai/types";

export default async function Page() {
  const reports = await listReports();
  const session = (await auth()) as Session;

  return (
    <>
      <PageBreadCrumb title="Reports & Insights" />
      <Upload user={session.user} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">File name</TableHead>
            <TableHead className="text-right">Date uploaded</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.PK}>
              <TableCell className="font-medium flex items-center">
                <FileTextIcon className="w-4 h-4 mr-2" />
                {report.title}
              </TableCell>
              <TableCell className="text-right">{report.dateCreated}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
