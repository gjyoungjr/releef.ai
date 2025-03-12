import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageBreadCrumb } from "@/components/page-breadcrumb";
import {
  CircleCheckBig,
  CheckCheckIcon,
  CircleDashed,
  Hourglass,
} from "lucide-react";
const DISCLOUSURES = [
  {
    name: "Basis for preparation of sustainability statement",
    disclosure:
      "The sustainability statement has been prepared in accordance with the EU Corporate Sustainability Reporting Directive (CSRD) and the European Sustainability Reporting Standards (ESRS). The methodology aligns with the Global Reporting Initiative (GRI) framework and integrates the principles of the Task Force on Climate-related Financial disclosures (TCFD). Materiality assessment has been conducted to determine the most relevant sustainability topics for stakeholders.",
    status: "Met",
  },
  {
    name: "Scope of consolidation of consolidated sustainability statement is same as for financial statements",
    disclosure:
      "The consolidated sustainability statement includes all entities within the financial consolidation scope, as per IFRS 10. No material deviations exist between the financial reporting and sustainability reporting perimeters. Joint ventures and associates are included on a proportional basis in sustainability disclosures.",
    status: "Partial",
  },
  {
    name: "Indication of subsidiary undertakings included in consolidation that are exempted from individual or consolidated sustainability reporting",
    disclosure:
      "Subsidiaries below the materiality threshold of €40 million in turnover are exempted from individual sustainability reporting. Three subsidiaries located in non-EU jurisdictions where local sustainability reporting is not mandatory are excluded from standalone reports but are covered under the group-level disclosure. A list of exempted subsidiaries, along with reasons for exemption, is provided in Annex B of the sustainability report.",
    status: "Partial",
  },
  {
    name: "Disclosure of extent to which sustainability statement covers upstream and downstream value chain",
    disclosure:
      "Scope 3 emissions reporting covers approximately 85% of the company’s upstream and downstream value chain, including key suppliers and logistics partners. Supplier due diligence assessments include environmental and human rights compliance for 90% of direct procurement spend. Customer product lifecycle impact disclosures include recyclability and carbon footprint estimates for major product categories.",
    status: "Partial",
  },
  {
    name: "Option allowed by Member State to omit disclosure of impending developments or matters in course of negotiation has been used",
    disclosure:
      "The company has exercised the option under national transposition of the CSRD to withhold disclosure of a pending renewable energy investment due to ongoing negotiations. Certain supplier contract renegotiations involving ESG performance clauses have been omitted due to commercial sensitivity. Any omissions are disclosed in compliance with the materiality and transparency requirements of the ESRS framework.",
    status: "Met",
  },
];

export default async function Page() {
  return (
    <div>
      <PageBreadCrumb title="Reports & Insights" />
      <Table>
        <TableHeader className="border-t">
          <TableRow>
            <TableHead>Requirement</TableHead>
            <TableHead>Checks</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {DISCLOUSURES.map((disclosure, index) => (
            <TableRow key={index}>
              <TableCell className="align-top">
                <div className="flex">
                  {disclosure.status.toLocaleLowerCase() === "met" ? (
                    <CircleCheckBig
                      className="w-4 h-4 mr-2 flex-shrink-0 mt-1"
                      color="green"
                    />
                  ) : (
                    <CircleDashed className="w-4 h-4 mr-2 flex-shrink-0 mt-1" />
                  )}

                  <span>{disclosure.name}</span>
                </div>
              </TableCell>
              <TableCell className="align-top">
                <div className="flex">
                  {disclosure.status.toLocaleLowerCase() === "partial" ? (
                    <Hourglass className="w-4 h-4 mr-2 flex-shrink-0 mt-1" />
                  ) : (
                    <CheckCheckIcon
                      className="w-4 h-4 mr-2 flex-shrink-0 mt-1"
                      color="green"
                    />
                  )}

                  <span>{disclosure.disclosure}</span>
                </div>
              </TableCell>
              <TableCell className="align-top">{disclosure.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
