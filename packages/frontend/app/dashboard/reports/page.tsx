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
import { Uploader } from "@/components/file-upload/uploader";
import { auth } from "@/auth";
import { Session } from "@releef.ai/types";
import { ReportActions } from "@/components/reports/report-actions";
import PageBreadCrumb from "@/components/page-breadcrumb";

export default async function Page() {
  const reports = await listReports();
  const session = (await auth()) as Session;

  return (
    <>
      <PageBreadCrumb title="Reports & Insights" />
      <Uploader user={session.user} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">File name</TableHead>
            <TableHead>Date uploaded</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.PK}>
              <TableCell className="font-medium flex items-center">
                <FileTextIcon className="w-4 h-4 mr-2" />
                {report.title}
              </TableCell>
              <TableCell>{report.dateCreated}</TableCell>
              <TableCell>
                <ReportActions report={report} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
