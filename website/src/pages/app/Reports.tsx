import { useState } from "react";
import { LuFileText, LuDownload, LuPlus, LuLoaderCircle, LuPresentation, LuShieldAlert, LuBadgeCheck, LuNetwork } from "react-icons/lu";
import PageHeader from "../../components/app/PageHeader";
import DataTable, { type DataTableColumn } from "../../components/app/DataTable";
import StatusBadge from "../../components/app/StatusBadge";
import Button from "../../components/ui/Button";
import GlassCard from "../../components/ui/GlassCard";
import { reports as initialReports, type Report } from "../../data/mock/reports";
import { useToast } from "../../context/ToastContext";
import { downloadJson, downloadTextFile } from "../../utils/download";
import { findings } from "../../data/mock/findings";
import { complianceControls } from "../../data/mock/complianceControls";
import { complianceFrameworks } from "../../data/complianceFrameworks";
import { awsResources } from "../../data/mock/awsResources";

const REPORT_TYPES: { type: Report["type"]; icon: typeof LuPresentation; description: string }[] = [
  { type: "Executive Summary", icon: LuPresentation, description: "Board-ready posture overview" },
  { type: "Security", icon: LuShieldAlert, description: "Findings, severity, remediation" },
  { type: "Compliance", icon: LuBadgeCheck, description: "Framework coverage & evidence" },
  { type: "Infrastructure", icon: LuNetwork, description: "Resources, cost, utilization" },
];

const FORMATS: Report["format"][] = ["PDF", "CSV", "JSON"];

function reportPayload(type: Report["type"]) {
  switch (type) {
    case "Security":
      return { findings };
    case "Compliance":
      return { frameworks: complianceFrameworks, controls: complianceControls };
    case "Infrastructure":
      return { resources: awsResources };
    case "Executive Summary":
    default:
      return {
        summary: "SkyShield Executive Summary",
        criticalFindings: findings.filter((f) => f.severity === "Critical").length,
        overallCompliance: Math.round(complianceFrameworks.reduce((s, f) => s + f.score, 0) / complianceFrameworks.length),
        monitoredResources: awsResources.length,
      };
  }
}

export default function Reports() {
  const { showToast } = useToast();
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [selectedType, setSelectedType] = useState<Report["type"]>("Executive Summary");
  const [selectedFormat, setSelectedFormat] = useState<Report["format"]>("PDF");

  function handleDownload(report: Report) {
    const slug = report.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const payload = { report: report.name, generatedAt: report.generated, ...reportPayload(report.type) };

    if (report.format === "CSV" && report.type === "Security") {
      const header = "severity,title,resource,status,discovered";
      const rows = findings.map((f) => `${f.severity},"${f.title}",${f.resource},${f.status},${f.discovered}`);
      downloadTextFile(`${slug}.csv`, [header, ...rows].join("\n"), "text/csv");
    } else {
      downloadJson(`${slug}.json`, payload);
    }
    showToast({ tone: "success", title: "Download started", description: report.name });
  }

  const columns: DataTableColumn<Report>[] = [
    {
      key: "name",
      header: "Report",
      sortValue: (r) => r.name,
      render: (r) => (
        <div className="flex items-center gap-2.5">
          {r.status === "Generating" ? (
            <LuLoaderCircle size={15} className="text-accent-2 shrink-0 animate-spin" aria-hidden="true" />
          ) : (
            <LuFileText size={15} className="text-accent-2 shrink-0" aria-hidden="true" />
          )}
          <span className="text-text">{r.name}</span>
        </div>
      ),
    },
    { key: "type", header: "Type" },
    { key: "period", header: "Period" },
    { key: "format", header: "Format" },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "generated", header: "Generated" },
    {
      key: "action",
      header: "",
      render: (r) =>
        r.status === "Ready" ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDownload(r);
            }}
            className="flex items-center gap-1.5 text-xs text-accent-2 hover:text-text transition-colors"
          >
            <LuDownload size={13} aria-hidden="true" />
            Download
          </button>
        ) : null,
    },
  ];

  function handleGenerate() {
    const id = `rep-${Date.now()}`;
    const newReport: Report = {
      id,
      name: `${selectedType} Report — ${new Date().toLocaleString("en-US", { month: "short", year: "numeric" })}`,
      type: selectedType,
      period: "Current",
      generated: "—",
      format: selectedFormat,
      status: "Generating",
    };
    setReports((prev) => [newReport, ...prev]);
    showToast({ tone: "info", title: "Generating report...", description: `${selectedType} · ${selectedFormat}` });

    setTimeout(() => {
      setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Ready", generated: "just now" } : r)));
      showToast({ tone: "success", title: "Report ready", description: `${newReport.name} is ready to download.` });
    }, 2400);
  }

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Audit-ready reports, generated automatically from live scan data."
      />

      <GlassCard hover={false} className="p-5 sm:p-6 mb-5">
        <h3 className="text-sm font-semibold text-text mb-4">Generate a Report</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {REPORT_TYPES.map((option) => (
            <button
              key={option.type}
              type="button"
              onClick={() => setSelectedType(option.type)}
              className={`text-left rounded-lg border px-4 py-3 transition-colors ${
                selectedType === option.type
                  ? "border-accent/50 bg-accent/10"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20"
              }`}
            >
              <option.icon size={16} className="text-accent-2 mb-2" aria-hidden="true" />
              <p className="text-sm text-text">{option.type}</p>
              <p className="text-xs text-text-muted mt-0.5">{option.description}</p>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted mr-1">Format</span>
            {FORMATS.map((format) => (
              <button
                key={format}
                type="button"
                onClick={() => setSelectedFormat(format)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  selectedFormat === format
                    ? "bg-accent/15 text-text border border-accent/40"
                    : "border border-white/10 text-text-muted hover:text-text"
                }`}
              >
                {format}
              </button>
            ))}
          </div>
          <Button variant="primary" className="text-sm px-5 py-2.5 gap-2" onClick={handleGenerate}>
            <LuPlus size={15} aria-hidden="true" />
            Generate Report
          </Button>
        </div>
      </GlassCard>

      <DataTable
        columns={columns}
        data={reports}
        rowKey={(row) => row.id}
        searchPlaceholder="Search reports..."
        searchFn={(row, q) => row.name.toLowerCase().includes(q)}
        filters={[
          { key: "type", label: "Type", options: ["Compliance", "Security", "Infrastructure", "Executive Summary"] },
        ]}
        getFilterValue={(row, key) => (key === "type" ? row.type : "")}
      />
    </div>
  );
}
