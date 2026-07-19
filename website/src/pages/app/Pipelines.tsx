import { useState } from "react";
import { LuWorkflow, LuCheck, LuX, LuTimer, LuCircleCheck, LuCircleX, LuLoaderCircle, LuCircleDashed } from "react-icons/lu";
import PageHeader from "../../components/app/PageHeader";
import StatTile from "../../components/app/StatTile";
import DataTable, { type DataTableColumn } from "../../components/app/DataTable";
import StatusBadge from "../../components/app/StatusBadge";
import SidePanel from "../../components/app/SidePanel";
import DetailRow from "../../components/app/DetailRow";
import { pipelineRuns, type PipelineRun, type PipelineStageResult } from "../../data/mock/pipelines";

const STAGE_ICON: Record<PipelineStageResult["status"], typeof LuCircleCheck> = {
  Passed: LuCircleCheck,
  Failed: LuCircleX,
  Running: LuLoaderCircle,
  Skipped: LuCircleDashed,
};

const STAGE_COLOR: Record<PipelineStageResult["status"], string> = {
  Passed: "text-accent-2",
  Failed: "text-danger",
  Running: "text-accent animate-spin",
  Skipped: "text-text-muted/50",
};

const columns: DataTableColumn<PipelineRun>[] = [
  { key: "id", header: "Run", render: (r) => <span className="text-text">{r.id}</span> },
  { key: "repo", header: "Repository", sortValue: (r) => r.repo },
  { key: "branch", header: "Branch" },
  { key: "stage", header: "Stage" },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  {
    key: "durationSec",
    header: "Duration",
    sortValue: (r) => r.durationSec,
    render: (r) => `${Math.floor(r.durationSec / 60)}m ${r.durationSec % 60}s`,
  },
  { key: "commitSha", header: "Commit", render: (r) => <span className="font-mono text-xs">{r.commitSha}</span> },
  { key: "author", header: "Author" },
  { key: "timestamp", header: "When" },
];

export default function Pipelines() {
  const [selected, setSelected] = useState<PipelineRun | null>(null);
  const passed = pipelineRuns.filter((r) => r.status === "Passed").length;
  const failed = pipelineRuns.filter((r) => r.status === "Failed").length;
  const avgDuration = Math.round(pipelineRuns.reduce((s, r) => s + r.durationSec, 0) / pipelineRuns.length);

  return (
    <div>
      <PageHeader
        title="DevSecOps Pipelines"
        description="GitHub → Terraform → Docker → Security Scan → Deploy → Monitor, every run. Click a run for the stage-by-stage breakdown."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatTile icon={LuWorkflow} label="Total Runs (30d)" value={String(pipelineRuns.length)} />
        <StatTile icon={LuCheck} label="Passed" value={String(passed)} trend={`${Math.round((passed / pipelineRuns.length) * 100)}% pass rate`} trendPositive />
        <StatTile icon={LuX} label="Failed" value={String(failed)} trendPositive={failed === 0} trend={failed > 0 ? "needs review" : "none"} />
        <StatTile icon={LuTimer} label="Avg Duration" value={`${Math.floor(avgDuration / 60)}m ${avgDuration % 60}s`} />
      </div>

      <DataTable
        columns={columns}
        data={pipelineRuns}
        rowKey={(row) => row.id}
        searchPlaceholder="Search pipelines..."
        searchFn={(row, q) => row.repo.toLowerCase().includes(q) || row.branch.toLowerCase().includes(q) || row.author.toLowerCase().includes(q)}
        filters={[
          { key: "stage", label: "Stage", options: ["Build", "Security Scan", "Deploy", "Monitor"] },
          { key: "status", label: "Status", options: ["Running", "Passed", "Failed", "Pending"] },
        ]}
        getFilterValue={(row, key) => (key === "stage" ? row.stage : key === "status" ? row.status : "")}
        pageSize={10}
        onRowClick={setSelected}
      />

      <SidePanel
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.id ?? ""}
        subtitle={selected ? `${selected.repo} · ${selected.branch}` : undefined}
      >
        {selected && (
          <div className="space-y-6">
            <div>
              <DetailRow label="Status" value={<StatusBadge status={selected.status} />} />
              <DetailRow label="Commit" value={<span className="font-mono text-xs">{selected.commitSha}</span>} />
              <DetailRow label="Author" value={selected.author} />
              <DetailRow label="Duration" value={`${Math.floor(selected.durationSec / 60)}m ${selected.durationSec % 60}s`} />
              <DetailRow label="When" value={selected.timestamp} />
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-3">Pipeline Stages</h3>
              <div className="space-y-1">
                {selected.stages.map((stage) => {
                  const Icon = STAGE_ICON[stage.status];
                  return (
                    <div key={stage.name} className="flex items-center gap-3 py-1.5">
                      <Icon size={15} className={`shrink-0 ${STAGE_COLOR[stage.status]}`} aria-hidden="true" />
                      <span className={`flex-1 text-sm ${stage.status === "Skipped" ? "text-text-muted/50" : "text-text"}`}>
                        {stage.name}
                      </span>
                      {stage.status !== "Skipped" && (
                        <span className="text-xs text-text-muted">{stage.durationSec}s</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </SidePanel>
    </div>
  );
}
