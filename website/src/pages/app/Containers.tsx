import { useState } from "react";
import { LuContainer, LuShieldAlert, LuHardDrive, LuKeyRound } from "react-icons/lu";
import PageHeader from "../../components/app/PageHeader";
import StatTile from "../../components/app/StatTile";
import DataTable, { type DataTableColumn } from "../../components/app/DataTable";
import SidePanel from "../../components/app/SidePanel";
import DetailRow from "../../components/app/DetailRow";
import StatusBadge from "../../components/app/StatusBadge";
import { containerImages, type ContainerImage } from "../../data/mock/containers";

function severityChip(count: number, tone: string) {
  if (count === 0) return null;
  return <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-semibold ${tone}`}>{count}</span>;
}

const columns: DataTableColumn<ContainerImage>[] = [
  {
    key: "image",
    header: "Image",
    sortValue: (r) => r.image,
    render: (r) => (
      <div>
        <span className="text-text">{r.image}</span>
        <span className="text-text-muted">:{r.tag}</span>
      </div>
    ),
  },
  { key: "registry", header: "Registry" },
  {
    key: "vulnerabilities",
    header: "Vulnerabilities",
    sortValue: (r) => r.critical * 1000 + r.high * 100 + r.medium * 10 + r.low,
    render: (r) => (
      <div className="flex items-center gap-1.5">
        {severityChip(r.critical, "bg-danger/15 text-danger")}
        {severityChip(r.high, "bg-orange-400/15 text-orange-400")}
        {severityChip(r.medium, "bg-amber-400/15 text-amber-400")}
        {severityChip(r.low, "bg-accent-2/15 text-accent-2")}
        {r.critical + r.high + r.medium + r.low === 0 && (
          <span className="text-xs text-text-muted">Clean</span>
        )}
      </div>
    ),
  },
  {
    key: "secrets",
    header: "Secrets",
    sortValue: (r) => r.secretsDetected,
    render: (r) =>
      r.secretsDetected > 0 ? (
        <span className="text-danger font-medium">{r.secretsDetected} found</span>
      ) : (
        <span className="text-text-muted">None</span>
      ),
  },
  { key: "sizeMb", header: "Size", sortValue: (r) => r.sizeMb, render: (r) => `${r.sizeMb} MB` },
  { key: "lastScanned", header: "Last Scanned" },
];

export default function Containers() {
  const [selected, setSelected] = useState<ContainerImage | null>(null);
  const totalCritical = containerImages.reduce((s, i) => s + i.critical, 0);
  const totalVulns = containerImages.reduce((s, i) => s + i.critical + i.high + i.medium + i.low, 0);
  const totalSize = containerImages.reduce((s, i) => s + i.sizeMb, 0);
  const totalSecrets = containerImages.reduce((s, i) => s + i.secretsDetected, 0);

  return (
    <div>
      <PageHeader title="Containers" description="Every image scanned by Trivy before it reaches production. Click a row for the full CVE breakdown." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatTile icon={LuContainer} label="Images Scanned" value={String(containerImages.length)} />
        <StatTile
          icon={LuShieldAlert}
          label="Total Vulnerabilities"
          value={String(totalVulns)}
          trend={`${totalCritical} critical`}
          trendPositive={totalCritical === 0}
        />
        <StatTile
          icon={LuKeyRound}
          label="Secrets Detected"
          value={String(totalSecrets)}
          trendPositive={totalSecrets === 0}
          trend={totalSecrets > 0 ? "rotate immediately" : "none"}
        />
        <StatTile icon={LuHardDrive} label="Total Registry Size" value={`${(totalSize / 1024).toFixed(1)} GB`} />
      </div>

      <DataTable
        columns={columns}
        data={containerImages}
        rowKey={(row) => row.id}
        searchPlaceholder="Search images..."
        searchFn={(row, q) => row.image.toLowerCase().includes(q)}
        pageSize={10}
        onRowClick={setSelected}
      />

      <SidePanel
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.image ?? ""}
        subtitle={selected ? `${selected.registry} · ${selected.tag}` : undefined}
      >
        {selected && (
          <div className="space-y-6">
            <div>
              <DetailRow label="Image Size" value={`${selected.sizeMb} MB`} />
              <DetailRow label="Last Scanned" value={selected.lastScanned} />
              <DetailRow
                label="Secrets Detected"
                value={selected.secretsDetected > 0 ? <StatusBadge status="Exposed" /> : <StatusBadge status="Passed" />}
              />
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">
                Trivy Scan Results
              </h3>
              {selected.cves.length > 0 ? (
                <ul className="space-y-2.5">
                  {selected.cves.map((cve) => (
                    <li key={cve.id} className="flex items-center justify-between gap-3 text-sm">
                      <div className="min-w-0">
                        <p className="text-text truncate">{cve.id}</p>
                        <p className="text-xs text-text-muted">
                          {cve.package} · fixed in {cve.fixedIn}
                        </p>
                      </div>
                      <StatusBadge status={cve.severity} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-accent-2">No known CVEs in this image.</p>
              )}
            </div>
          </div>
        )}
      </SidePanel>
    </div>
  );
}
