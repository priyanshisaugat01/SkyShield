import { useState } from "react";
import { LuShieldAlert, LuCircleCheck, LuClock } from "react-icons/lu";
import PageHeader from "../../components/app/PageHeader";
import StatTile from "../../components/app/StatTile";
import ChartCard from "../../components/app/ChartCard";
import SeverityBarChart from "../../components/app/charts/SeverityBarChart";
import DataTable, { type DataTableColumn } from "../../components/app/DataTable";
import StatusBadge from "../../components/app/StatusBadge";
import SidePanel from "../../components/app/SidePanel";
import { findings, type Finding } from "../../data/mock/findings";
import { findingsBySeverity } from "../../data/mock/trends";

const columns: DataTableColumn<Finding>[] = [
  {
    key: "severity",
    header: "Severity",
    sortValue: (r) => ({ Critical: 3, High: 2, Medium: 1, Low: 0 })[r.severity],
    render: (r) => <StatusBadge status={r.severity} />,
  },
  { key: "title", header: "Finding", render: (r) => <span className="text-text">{r.title}</span> },
  { key: "resource", header: "Resource" },
  { key: "category", header: "Category" },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "assignee", header: "Assignee" },
  { key: "discovered", header: "Discovered" },
];

export default function SecurityFindings() {
  const [selected, setSelected] = useState<Finding | null>(null);
  const open = findings.filter((f) => f.status === "Open").length;
  const resolved = findings.filter((f) => f.status === "Resolved").length;

  return (
    <div>
      <PageHeader title="Security Findings" description="Every finding SkyShield has surfaced, prioritized by severity. Click a row for full detail." />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <StatTile icon={LuShieldAlert} label="Total Findings" value={String(findings.length)} />
        <StatTile icon={LuClock} label="Open" value={String(open)} trendPositive={false} trend="needs triage" />
        <StatTile icon={LuCircleCheck} label="Resolved" value={String(resolved)} trend={`${Math.round((resolved / findings.length) * 100)}% closed`} trendPositive />
      </div>

      <ChartCard title="Findings by Severity" className="mb-5">
        <SeverityBarChart data={findingsBySeverity} height={200} />
      </ChartCard>

      <DataTable
        columns={columns}
        data={findings}
        rowKey={(row) => row.id}
        searchPlaceholder="Search findings..."
        searchFn={(row, q) => row.title.toLowerCase().includes(q) || row.resource.toLowerCase().includes(q)}
        filters={[
          { key: "severity", label: "Severity", options: ["Critical", "High", "Medium", "Low"] },
          { key: "status", label: "Status", options: ["Open", "In Progress", "Resolved"] },
          { key: "category", label: "Category", options: ["IAM", "Network", "Data", "Compute", "Container", "Compliance"] },
        ]}
        getFilterValue={(row, key) =>
          key === "severity" ? row.severity : key === "status" ? row.status : key === "category" ? row.category : ""
        }
        pageSize={10}
        onRowClick={setSelected}
      />

      <SidePanel
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.title ?? ""}
        subtitle={selected ? `${selected.resource} · ${selected.affectedService}` : undefined}
      >
        {selected && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={selected.severity} />
              <StatusBadge status={selected.status} />
              <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-text-muted">
                {selected.category}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-text-muted mb-1">Assigned To</p>
                <p className="text-text">{selected.assignee}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">Affected Service</p>
                <p className="text-text">{selected.affectedService}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">Recommendation</h3>
              <p className="text-sm text-text leading-relaxed">{selected.recommendation}</p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">Fix Steps</h3>
              <ol className="space-y-2">
                {selected.fixSteps.map((step, index) => (
                  <li key={step} className="flex items-start gap-2.5 text-sm text-text-muted">
                    <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-text shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">Timeline</h3>
              <div className="relative pl-5">
                <div className="absolute left-[3px] top-1 bottom-1 w-px bg-white/10" aria-hidden="true" />
                <div className="space-y-4">
                  {selected.timeline.map((entry) => (
                    <div key={entry.label} className="relative">
                      <span className="absolute -left-5 top-1 w-2 h-2 rounded-full bg-accent-2" aria-hidden="true" />
                      <p className="text-sm text-text">{entry.label}</p>
                      <p className="text-xs text-text-muted">{entry.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </SidePanel>
    </div>
  );
}
