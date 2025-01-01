import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileTextIcon } from "lucide-react";
import { listReports } from "./action";

export default async function Page() {
  const reports = await listReports();

  return (
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
      <TableFooter></TableFooter>
    </Table>
  );
}
