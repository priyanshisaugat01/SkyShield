import { useState } from "react";
import { LuFileCode, LuGitCommitHorizontal, LuShieldCheck, LuGitCompareArrows, LuGauge } from "react-icons/lu";
import PageHeader from "../../components/app/PageHeader";
import StatTile from "../../components/app/StatTile";
import DataTable, { type DataTableColumn } from "../../components/app/DataTable";
import StatusBadge from "../../components/app/StatusBadge";
import GlassCard from "../../components/ui/GlassCard";
import SidePanel from "../../components/app/SidePanel";
import DetailRow from "../../components/app/DetailRow";
import { terraformRuns, terraformModules, type TerraformRun, type TerraformModule } from "../../data/mock/terraformRuns";

const columns: DataTableColumn<TerraformRun>[] = [
  { key: "id", header: "Run", render: (r) => <span className="text-text">{r.id}</span> },
  { key: "workspace", header: "Workspace", sortValue: (r) => r.workspace },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "resourcesChanged", header: "Resources Changed", sortValue: (r) => r.resourcesChanged },
  {
    key: "checkovFindings",
    header: "Checkov Findings",
    sortValue: (r) => r.checkovFindings,
    render: (r) =>
      r.checkovFindings > 0 ? (
        <span className="text-danger font-medium">{r.checkovFindings}</span>
      ) : (
        <span className="text-text-muted">0</span>
      ),
  },
  { key: "triggeredBy", header: "Triggered By" },
  { key: "timestamp", header: "When" },
];

export default function Terraform() {
  const [selectedRun, setSelectedRun] = useState<TerraformRun | null>(null);
  const [selectedModule, setSelectedModule] = useState<TerraformModule | null>(null);
  const applied = terraformRuns.filter((r) => r.status === "Applied").length;
  const findings = terraformRuns.reduce((s, r) => s + r.checkovFindings, 0);
  const driftedModules = terraformModules.filter((m) => m.drift).length;
  const avgSecurityScore = Math.round(
    terraformModules.reduce((s, m) => s + m.securityScore, 0) / terraformModules.length
  );
  const latestApply = terraformRuns.find((r) => r.status === "Applied");

  return (
    <div>
      <PageHeader title="Terraform" description="Every plan and apply, scanned by Checkov before it ships." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatTile icon={LuFileCode} label="Total Runs" value={String(terraformRuns.length)} />
        <StatTile icon={LuGitCommitHorizontal} label="Applied" value={String(applied)} trend={`${terraformRuns.length - applied} other`} trendPositive />
        <StatTile icon={LuGauge} label="Security Score" value={String(avgSecurityScore)} suffix="/100" numeric trendPositive={avgSecurityScore >= 90} trend={avgSecurityScore >= 90 ? "strong" : "needs review"} />
        <StatTile icon={LuGitCompareArrows} label="Modules with Drift" value={String(driftedModules)} trendPositive={driftedModules === 0} trend={driftedModules > 0 ? "reconcile needed" : "none"} />
      </div>

      {latestApply && (
        <GlassCard hover={false} className="p-4 mb-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">Latest Apply</span>
          <span className="text-text">{latestApply.id}</span>
          <span className="text-text-muted">{latestApply.workspace}</span>
          <StatusBadge status={latestApply.status} />
          <span className="text-text-muted">{latestApply.resourcesChanged} resources changed</span>
          <span className="text-text-muted">by {latestApply.triggeredBy}</span>
          <span className="text-text-muted">{latestApply.timestamp}</span>
        </GlassCard>
      )}

      <h3 className="text-sm font-semibold text-text mb-3">Modules</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {terraformModules.map((mod) => (
          <button key={mod.id} type="button" onClick={() => setSelectedModule(mod)} className="text-left">
            <GlassCard className="p-5 h-full">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-text">{mod.name}</h4>
                <StatusBadge status={mod.drift ? "Degraded" : "Healthy"} />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center mb-3">
                <div>
                  <p className="text-base font-semibold text-text">{mod.resources}</p>
                  <p className="text-[10px] text-text-muted">Resources</p>
                </div>
                <div>
                  <p className="text-base font-semibold text-text">{mod.variables}</p>
                  <p className="text-[10px] text-text-muted">Variables</p>
                </div>
                <div>
                  <p className="text-base font-semibold text-text">{mod.outputs}</p>
                  <p className="text-[10px] text-text-muted">Outputs</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>{mod.drift ? "Drift detected" : "No drift"}</span>
                <span>{mod.lastApplied}</span>
              </div>
            </GlassCard>
          </button>
        ))}
      </div>

      <h3 className="text-sm font-semibold text-text mb-3">Runs</h3>
      <DataTable
        columns={columns}
        data={terraformRuns}
        rowKey={(row) => row.id}
        searchPlaceholder="Search runs..."
        searchFn={(row, q) => row.workspace.toLowerCase().includes(q) || row.triggeredBy.toLowerCase().includes(q)}
        filters={[{ key: "status", label: "Status", options: ["Applied", "Planned", "Failed"] }]}
        getFilterValue={(row, key) => (key === "status" ? row.status : "")}
        pageSize={10}
        onRowClick={setSelectedRun}
      />

      {findings === 0 && (
        <p className="mt-3 text-xs text-accent-2">All Checkov scans across the last 16 runs are clean.</p>
      )}

      <SidePanel
        open={selectedRun !== null}
        onClose={() => setSelectedRun(null)}
        title={selectedRun?.id ?? ""}
        subtitle={selectedRun?.workspace}
      >
        {selectedRun && (
          <div className="space-y-6">
            <div>
              <DetailRow label="Status" value={<StatusBadge status={selectedRun.status} />} />
              <DetailRow label="Resources Changed" value={selectedRun.resourcesChanged} />
              <DetailRow label="Triggered By" value={selectedRun.triggeredBy} />
              <DetailRow label="When" value={selectedRun.timestamp} />
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">
                Checkov Scan Results
              </h3>
              {selectedRun.checkovDetails.length > 0 ? (
                <ul className="space-y-2">
                  {selectedRun.checkovDetails.map((finding) => (
                    <li key={finding} className="flex items-start gap-2.5 text-sm text-text-muted">
                      <LuShieldCheck size={15} className="text-danger shrink-0 mt-0.5" aria-hidden="true" />
                      {finding}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-accent-2">No misconfigurations found in this run.</p>
              )}
            </div>
          </div>
        )}
      </SidePanel>

      <SidePanel
        open={selectedModule !== null}
        onClose={() => setSelectedModule(null)}
        title={selectedModule?.name ?? ""}
        subtitle={selectedModule ? `infra/${selectedModule.name}` : undefined}
      >
        {selectedModule && (
          <div className="space-y-6">
            <div>
              <DetailRow label="Status" value={<StatusBadge status={selectedModule.drift ? "Degraded" : "Healthy"} />} />
              <DetailRow label="Resources" value={selectedModule.resources} />
              <DetailRow label="Variables" value={selectedModule.variables} />
              <DetailRow label="Outputs" value={selectedModule.outputs} />
              <DetailRow label="Security Score" value={`${selectedModule.securityScore}/100`} />
              <DetailRow label="Last Applied" value={selectedModule.lastApplied} />
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">Resource Types</h3>
              <div className="flex flex-wrap gap-2">
                {selectedModule.resourceTypes.map((type) => (
                  <span key={type} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-text-muted font-mono">
                    {type}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">Infrastructure Drift</h3>
              {selectedModule.driftDetail ? (
                <p className="text-sm text-amber-400 leading-relaxed">{selectedModule.driftDetail}</p>
              ) : (
                <p className="text-sm text-accent-2">State matches real infrastructure — no drift detected.</p>
              )}
            </div>
          </div>
        )}
      </SidePanel>
    </div>
  );
}
