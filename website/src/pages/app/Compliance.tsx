import { useRef, useState } from "react";
import { LuBadgeCheck, LuCircleAlert, LuFileCheck, LuScanLine, LuLoaderCircle, LuDownload, LuFileJson } from "react-icons/lu";
import PageHeader from "../../components/app/PageHeader";
import StatTile from "../../components/app/StatTile";
import ChartCard from "../../components/app/ChartCard";
import TrendAreaChart from "../../components/app/charts/TrendAreaChart";
import DonutChart from "../../components/app/charts/DonutChart";
import DataTable, { type DataTableColumn } from "../../components/app/DataTable";
import StatusBadge from "../../components/app/StatusBadge";
import Button from "../../components/ui/Button";
import { complianceControls, complianceScanHistory, type ComplianceControl, type ComplianceScan } from "../../data/mock/complianceControls";
import { complianceFrameworks } from "../../data/complianceFrameworks";
import { complianceTrend } from "../../data/mock/trends";
import { useToast } from "../../context/ToastContext";
import { downloadJson, downloadTextFile } from "../../utils/download";

const FRAMEWORKS = complianceFrameworks.map((f) => f.name);

function scoreColor(score: number) {
  if (score >= 95) return "#22d3ee";
  if (score >= 90) return "#3b82f6";
  return "#facc15";
}

const columns: DataTableColumn<ComplianceControl>[] = [
  { key: "framework", header: "Framework", sortValue: (r) => r.framework },
  { key: "control", header: "Control", render: (r) => <span className="text-text">{r.control}</span> },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "lastChecked", header: "Last Checked" },
];

const historyColumns: DataTableColumn<ComplianceScan>[] = [
  { key: "id", header: "Scan", render: (r) => <span className="text-text">{r.id}</span> },
  { key: "frameworks", header: "Scope" },
  { key: "passed", header: "Passed", render: (r) => <span className="text-accent-2">{r.passed}</span> },
  { key: "failed", header: "Failed", render: (r) => <span className={r.failed > 0 ? "text-danger" : "text-text-muted"}>{r.failed}</span> },
  { key: "triggeredBy", header: "Triggered By" },
  { key: "timestamp", header: "When" },
];

export default function Compliance() {
  const { showToast } = useToast();
  const [scanning, setScanning] = useState(false);
  const [frameworkFilter, setFrameworkFilter] = useState<string | null>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const compliant = complianceControls.filter((c) => c.status === "Compliant").length;
  const nonCompliant = complianceControls.filter((c) => c.status === "Non-Compliant").length;
  const inReview = complianceControls.filter((c) => c.status === "In Review").length;
  const overall = Math.round(complianceFrameworks.reduce((s, f) => s + f.score, 0) / complianceFrameworks.length);

  function handleRunScan() {
    if (scanning) return;
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      showToast({
        tone: "success",
        title: "Compliance scan complete",
        description: `${compliant} controls passed, ${nonCompliant} require attention.`,
      });
    }, 2200);
  }

  function handleExport(format: "PDF" | "CSV") {
    showToast({ tone: "info", title: `Preparing ${format} export...` });
    setTimeout(() => {
      if (format === "CSV") {
        const header = "framework,control,status,lastChecked";
        const rows = complianceControls.map((c) => `"${c.framework}","${c.control}",${c.status},${c.lastChecked}`);
        downloadTextFile("skyshield-compliance-controls.csv", [header, ...rows].join("\n"), "text/csv");
      } else {
        downloadJson("skyshield-compliance-report.json", {
          generatedAt: new Date().toISOString(),
          overallScore: overall,
          frameworks: complianceFrameworks,
          controls: complianceControls,
        });
      }
      showToast({ tone: "success", title: `${format} export ready`, description: "Check your downloads folder." });
    }, 900);
  }

  function handleFrameworkClick(name: string) {
    setFrameworkFilter(name);
    controlsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div>
      <PageHeader
        title="Compliance Center"
        description="Continuous evidence, mapped to the frameworks your auditors ask about."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleExport("CSV")}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3.5 py-2 text-xs text-text-muted hover:text-text hover:border-accent/40 transition-colors"
            >
              <LuFileJson size={13} aria-hidden="true" />
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => handleExport("PDF")}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3.5 py-2 text-xs text-text-muted hover:text-text hover:border-accent/40 transition-colors"
            >
              <LuDownload size={13} aria-hidden="true" />
              Download PDF
            </button>
            <Button variant="primary" className="text-xs px-4 py-2 gap-2" onClick={handleRunScan} disabled={scanning}>
              {scanning ? (
                <LuLoaderCircle size={14} className="animate-spin" aria-hidden="true" />
              ) : (
                <LuScanLine size={14} aria-hidden="true" />
              )}
              {scanning ? "Scanning..." : "Run Scan"}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <StatTile icon={LuBadgeCheck} label="Overall Compliance" value={String(overall)} suffix="%" numeric trend="+2% this week" trendPositive />
        <StatTile icon={LuFileCheck} label="Compliant Controls" value={String(compliant)} trend={`of ${complianceControls.length}`} trendPositive />
        <StatTile icon={LuCircleAlert} label="Non-Compliant" value={String(nonCompliant)} trendPositive={nonCompliant === 0} trend={nonCompliant > 0 ? "action needed" : "none"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <ChartCard title="Compliance Trend — 14 Days" className="lg:col-span-2">
          <TrendAreaChart data={complianceTrend} xKey="day" yKey="score" color="#22d3ee" />
        </ChartCard>
        <ChartCard title="Control Breakdown">
          <DonutChart
            data={[
              { name: "Compliant", value: compliant, color: "#22d3ee" },
              { name: "In Review", value: inReview, color: "#facc15" },
              { name: "Non-Compliant", value: nonCompliant, color: "#f87171" },
            ]}
            centerValue={String(complianceControls.length)}
            centerLabel="Controls"
          />
        </ChartCard>
      </div>

      <ChartCard title="Framework Coverage" description="Click a framework to filter its controls below" className="mb-5">
        <div className="space-y-5">
          {complianceFrameworks.map((framework) => (
            <button
              key={framework.name}
              type="button"
              onClick={() => handleFrameworkClick(framework.name)}
              className="block w-full text-left group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-text group-hover:text-accent-2 transition-colors">{framework.name}</span>
                <span className="text-sm font-semibold text-text">{framework.score}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${framework.score}%`, backgroundColor: scoreColor(framework.score) }}
                />
              </div>
            </button>
          ))}
        </div>
      </ChartCard>

      <h3 className="text-sm font-semibold text-text mb-3">Previous Scans</h3>
      <div className="mb-5">
        <DataTable
          columns={historyColumns}
          data={complianceScanHistory}
          rowKey={(row) => row.id}
          pageSize={5}
        />
      </div>

      <div ref={controlsRef}>
        <DataTable
          key={frameworkFilter ?? "all"}
          columns={columns}
          data={complianceControls}
          rowKey={(row) => row.id}
          searchPlaceholder="Search controls..."
          searchFn={(row, q) => row.control.toLowerCase().includes(q)}
          filters={[
            { key: "framework", label: "Framework", options: FRAMEWORKS },
            { key: "status", label: "Status", options: ["Compliant", "Non-Compliant", "In Review"] },
          ]}
          getFilterValue={(row, key) => (key === "framework" ? row.framework : key === "status" ? row.status : "")}
          pageSize={10}
          initialFilters={frameworkFilter ? { framework: frameworkFilter } : undefined}
        />
      </div>
    </div>
  );
}
