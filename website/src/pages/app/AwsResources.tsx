import { useState } from "react";
import { LuCloud, LuDollarSign, LuTriangleAlert } from "react-icons/lu";
import PageHeader from "../../components/app/PageHeader";
import StatTile from "../../components/app/StatTile";
import DataTable, { type DataTableColumn } from "../../components/app/DataTable";
import StatusBadge from "../../components/app/StatusBadge";
import SidePanel from "../../components/app/SidePanel";
import DetailRow from "../../components/app/DetailRow";
import { awsResources, type AwsResource } from "../../data/mock/awsResources";

const TYPES = ["EC2", "S3", "Lambda", "RDS", "VPC", "IAM Role", "ECS", "CloudFront", "DynamoDB"];

const columns: DataTableColumn<AwsResource>[] = [
  { key: "name", header: "Resource", sortValue: (r) => r.name, render: (r) => <span className="text-text">{r.name}</span> },
  { key: "type", header: "Type" },
  { key: "region", header: "Region" },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  {
    key: "monthlyCost",
    header: "Monthly Cost",
    sortValue: (r) => r.monthlyCost,
    render: (r) => `$${r.monthlyCost.toLocaleString()}`,
  },
  { key: "lastModified", header: "Last Modified" },
];

export default function AwsResources() {
  const [selected, setSelected] = useState<AwsResource | null>(null);
  const totalCost = awsResources.reduce((sum, r) => sum + r.monthlyCost, 0);
  const critical = awsResources.filter((r) => r.status === "Critical").length;

  return (
    <div>
      <PageHeader
        title="AWS Resources"
        description="Every resource SkyShield discovers across your connected AWS accounts. Click a row to inspect its configuration."
      />

      <div className="grid sm:grid-cols-3 gap-4 mb-5">
        <StatTile icon={LuCloud} label="Total Resources" value={String(awsResources.length)} />
        <StatTile icon={LuDollarSign} label="Estimated Monthly Spend" value={`$${totalCost.toLocaleString()}`} />
        <StatTile icon={LuTriangleAlert} label="Critical Status" value={String(critical)} trend="needs attention" trendPositive={critical === 0} />
      </div>

      <DataTable
        columns={columns}
        data={awsResources}
        rowKey={(row) => row.id}
        searchPlaceholder="Search resources..."
        searchFn={(row, q) => row.name.toLowerCase().includes(q) || row.type.toLowerCase().includes(q)}
        filters={[
          { key: "type", label: "Type", options: TYPES },
          { key: "status", label: "Status", options: ["Healthy", "Degraded", "Critical"] },
        ]}
        getFilterValue={(row, key) => (key === "type" ? row.type : key === "status" ? row.status : "")}
        pageSize={10}
        onRowClick={setSelected}
      />

      <SidePanel
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ""}
        subtitle={selected ? `${selected.type} · ${selected.region}` : undefined}
      >
        {selected && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Status</span>
              <StatusBadge status={selected.status} />
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">Security</h3>
              <p className="text-sm text-text leading-relaxed">{selected.security}</p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">Configuration</h3>
              <p className="text-sm text-text leading-relaxed">{selected.configuration}</p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">Recent Events</h3>
              <ul className="space-y-2">
                {selected.recentEvents.map((event) => (
                  <li key={event} className="text-sm text-text-muted flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-2 mt-1.5 shrink-0" aria-hidden="true" />
                    {event}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-1">Details</h3>
              <DetailRow label="ARN" value={<span className="break-all text-xs">{selected.arn}</span>} />
              <DetailRow label="Monthly Cost" value={`$${selected.monthlyCost.toLocaleString()}`} />
              <DetailRow label="Last Modified" value={selected.lastModified} />
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(selected.tags).map(([key, value]) => (
                  <span
                    key={key}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-text-muted"
                  >
                    {key}: <span className="text-text">{value}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </SidePanel>
    </div>
  );
}
