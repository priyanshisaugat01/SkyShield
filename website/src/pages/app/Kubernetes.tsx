import { useState } from "react";
import { LuServerCog, LuBoxes, LuRefreshCw, LuLayers, LuNetwork, LuWaypoints } from "react-icons/lu";
import PageHeader from "../../components/app/PageHeader";
import StatTile from "../../components/app/StatTile";
import DataTable, { type DataTableColumn } from "../../components/app/DataTable";
import StatusBadge from "../../components/app/StatusBadge";
import GlassCard from "../../components/ui/GlassCard";
import SidePanel from "../../components/app/SidePanel";
import DetailRow from "../../components/app/DetailRow";
import {
  k8sClusters,
  k8sWorkloads,
  k8sNamespaces,
  k8sResourceCounts,
  k8sClusterEvents,
  type K8sWorkload,
} from "../../data/mock/kubernetes";

const columns: DataTableColumn<K8sWorkload>[] = [
  { key: "name", header: "Workload", sortValue: (r) => r.name, render: (r) => <span className="text-text">{r.name}</span> },
  { key: "namespace", header: "Namespace" },
  { key: "kind", header: "Kind" },
  { key: "replicas", header: "Replicas" },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "restarts", header: "Restarts", sortValue: (r) => r.restarts },
];

const RESOURCE_TILES = [
  { label: "Deployments", key: "deployments" as const, icon: LuBoxes },
  { label: "ReplicaSets", key: "replicaSets" as const, icon: LuLayers },
  { label: "Services", key: "services" as const, icon: LuNetwork },
  { label: "Ingress", key: "ingress" as const, icon: LuWaypoints },
];

const EVENT_COLOR: Record<string, string> = {
  info: "#94a3b8",
  warning: "#facc15",
  critical: "#f87171",
};

export default function Kubernetes() {
  const [selected, setSelected] = useState<K8sWorkload | null>(null);
  const totalNodes = k8sClusters.reduce((s, c) => s + c.nodesTotal, 0);
  const healthyNodes = k8sClusters.reduce((s, c) => s + c.nodesHealthy, 0);

  return (
    <div>
      <PageHeader title="Kubernetes" description="Cluster health, workloads, and node status across every region." />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <StatTile icon={LuServerCog} label="Clusters" value={String(k8sClusters.length)} />
        <StatTile
          icon={LuBoxes}
          label="Nodes Healthy"
          value={`${healthyNodes}/${totalNodes}`}
          trend={totalNodes - healthyNodes > 0 ? `${totalNodes - healthyNodes} degraded` : "all healthy"}
          trendPositive={totalNodes === healthyNodes}
        />
        <StatTile icon={LuRefreshCw} label="Workloads" value={String(k8sWorkloads.length)} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {RESOURCE_TILES.map((tile) => (
          <StatTile key={tile.key} icon={tile.icon} label={tile.label} value={String(k8sResourceCounts[tile.key])} />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
        {k8sClusters.map((cluster) => (
          <GlassCard key={cluster.id} className="p-5" hover={false}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-text">{cluster.name}</h3>
              <StatusBadge status={cluster.status} />
            </div>
            <p className="text-xs text-text-muted mb-4">
              v{cluster.version} · {cluster.region}
            </p>
            <div className="flex items-center justify-between mb-1.5 text-xs text-text-muted">
              <span>Nodes</span>
              <span>
                {cluster.nodesHealthy}/{cluster.nodesTotal}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className={`h-full rounded-full ${cluster.status === "Healthy" ? "gradient-accent" : "bg-amber-400"}`}
                style={{ width: `${(cluster.nodesHealthy / cluster.nodesTotal) * 100}%` }}
              />
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <GlassCard hover={false} className="p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-text mb-4">Namespaces</h3>
          <div className="space-y-3">
            {k8sNamespaces.map((ns) => (
              <div key={ns.name} className="flex items-center justify-between text-sm">
                <span className="text-text-muted">{ns.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-text-muted">{ns.pods} pods</span>
                  <StatusBadge status={ns.status} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard hover={false} className="p-5 sm:p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold text-text mb-4">Cluster Events</h3>
          <div className="space-y-3.5">
            {k8sClusterEvents.map((event) => (
              <div key={event.message} className="flex items-start gap-3 text-sm">
                <span
                  className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                  style={{ backgroundColor: EVENT_COLOR[event.severity] }}
                  aria-hidden="true"
                />
                <span className="flex-1 min-w-0 text-text-muted">{event.message}</span>
                <span className="text-xs text-text-muted shrink-0">{event.time}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <DataTable
        columns={columns}
        data={k8sWorkloads}
        rowKey={(row) => row.id}
        searchPlaceholder="Search workloads..."
        searchFn={(row, q) => row.name.toLowerCase().includes(q) || row.namespace.toLowerCase().includes(q)}
        filters={[
          { key: "kind", label: "Kind", options: ["Deployment", "StatefulSet", "DaemonSet"] },
          { key: "status", label: "Status", options: ["Running", "Degraded", "Pending"] },
        ]}
        getFilterValue={(row, key) => (key === "kind" ? row.kind : key === "status" ? row.status : "")}
        onRowClick={setSelected}
      />

      <SidePanel
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ""}
        subtitle={selected ? `${selected.namespace} · ${selected.kind}` : undefined}
      >
        {selected && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Status</span>
              <StatusBadge status={selected.status} />
            </div>

            <div>
              <DetailRow label="Image" value={<span className="text-xs break-all">{selected.image}</span>} />
              <DetailRow label="Replicas" value={selected.replicas} />
              <DetailRow label="CPU Request" value={selected.cpuRequest} />
              <DetailRow label="Memory Request" value={selected.memoryRequest} />
              <DetailRow label="Restarts" value={selected.restarts} />
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
          </div>
        )}
      </SidePanel>
    </div>
  );
}
