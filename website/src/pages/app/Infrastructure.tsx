import { useState } from "react";
import { LuNetwork, LuServer, LuGlobe, LuLayers } from "react-icons/lu";
import PageHeader from "../../components/app/PageHeader";
import StatTile from "../../components/app/StatTile";
import ChartCard from "../../components/app/ChartCard";
import DonutChart from "../../components/app/charts/DonutChart";
import DataTable, { type DataTableColumn } from "../../components/app/DataTable";
import StatusBadge from "../../components/app/StatusBadge";
import GlassCard from "../../components/ui/GlassCard";
import SidePanel from "../../components/app/SidePanel";
import DetailRow from "../../components/app/DetailRow";
import AwsTopology from "../../components/app/AwsTopology";
import { vpcs, resourceByType, regions, type VpcSummary } from "../../data/mock/infrastructure";
import type { TopologyNode } from "../../data/mock/awsTopology";

const columns: DataTableColumn<VpcSummary>[] = [
  { key: "name", header: "VPC", sortValue: (r) => r.name, render: (r) => <span className="text-text">{r.name}</span> },
  { key: "region", header: "Region", sortValue: (r) => r.region },
  { key: "cidr", header: "CIDR Block" },
  { key: "subnets", header: "Subnets", sortValue: (r) => r.subnets },
  { key: "instances", header: "Instances", sortValue: (r) => r.instances },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

export default function Infrastructure() {
  const totalResources = regions.reduce((sum, r) => sum + r.resources, 0);
  const [selectedNode, setSelectedNode] = useState<TopologyNode | null>(null);

  return (
    <div>
      <PageHeader
        title="Infrastructure"
        description="A live map of every VPC, subnet, and region SkyShield monitors."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatTile icon={LuNetwork} label="VPCs Monitored" value={String(vpcs.length)} />
        <StatTile icon={LuLayers} label="Subnets" value={String(vpcs.reduce((s, v) => s + v.subnets, 0))} />
        <StatTile icon={LuServer} label="Total Instances" value={String(vpcs.reduce((s, v) => s + v.instances, 0))} />
        <StatTile icon={LuGlobe} label="Active Regions" value={String(regions.length)} />
      </div>

      <ChartCard
        title="AWS Topology — Production Request Path"
        description="Click any service to inspect health, security posture, configuration, and recent events."
        className="mb-5"
      >
        <AwsTopology onSelectNode={setSelectedNode} />
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <ChartCard title="Resources by Type" description={`${totalResources} resources tracked`}>
          <DonutChart data={resourceByType} centerValue={String(totalResources)} centerLabel="Resources" />
        </ChartCard>

        <GlassCard hover={false} className="p-5 sm:p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold text-text mb-4">Resources by Region</h3>
          <div className="space-y-4">
            {regions.map((region) => (
              <div key={region.name}>
                <div className="flex items-center justify-between mb-1.5 text-sm">
                  <span className="text-text">
                    {region.label} <span className="text-text-muted">({region.name})</span>
                  </span>
                  <span className="text-text-muted">{region.resources}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full gradient-accent"
                    style={{ width: `${(region.resources / totalResources) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <DataTable
        columns={columns}
        data={vpcs}
        rowKey={(row) => row.id}
        searchPlaceholder="Search VPCs..."
        searchFn={(row, q) => row.name.toLowerCase().includes(q) || row.region.toLowerCase().includes(q)}
        filters={[{ key: "status", label: "Status", options: ["Healthy", "Degraded"] }]}
        getFilterValue={(row, key) => (key === "status" ? row.status : "")}
      />

      <SidePanel
        open={selectedNode !== null}
        onClose={() => setSelectedNode(null)}
        title={selectedNode?.label ?? ""}
        subtitle={selectedNode ? `${selectedNode.region} · ${selectedNode.az}` : undefined}
      >
        {selectedNode && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Health</span>
              <StatusBadge status={selectedNode.health} />
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">Security</h3>
              <p className="text-sm text-text leading-relaxed">{selectedNode.security}</p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">Configuration</h3>
              <p className="text-sm text-text leading-relaxed">{selectedNode.configuration}</p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">Recent Events</h3>
              <ul className="space-y-2">
                {selectedNode.recentEvents.map((event) => (
                  <li key={event} className="text-sm text-text-muted flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-2 mt-1.5 shrink-0" aria-hidden="true" />
                    {event}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-1">Details</h3>
              <DetailRow label="Region" value={selectedNode.region} />
              <DetailRow label="Availability Zone" value={selectedNode.az} />
              <DetailRow label="Estimated Monthly Cost" value={selectedNode.monthlyCost} />
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(selectedNode.tags).map(([key, value]) => (
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
