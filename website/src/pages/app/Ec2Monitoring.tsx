import { useState } from "react";
import { LuServer, LuCpu, LuPower, LuMemoryStick, LuArrowRightLeft, LuHardDrive, LuActivity } from "react-icons/lu";
import PageHeader from "../../components/app/PageHeader";
import StatTile from "../../components/app/StatTile";
import ChartCard from "../../components/app/ChartCard";
import TrendAreaChart from "../../components/app/charts/TrendAreaChart";
import DataTable, { type DataTableColumn } from "../../components/app/DataTable";
import StatusBadge from "../../components/app/StatusBadge";
import GlassCard from "../../components/ui/GlassCard";
import LiveMetricCard from "../../components/effects/LiveMetricCard";
import SidePanel from "../../components/app/SidePanel";
import DetailRow from "../../components/app/DetailRow";
import { ec2Instances, type Ec2Instance } from "../../data/mock/ec2Instances";
import { riskTrend } from "../../data/mock/trends";
import { cloudwatchAlarms } from "../../data/mock/dashboardOps";

const cpuTrend = riskTrend.map((point) => ({ day: point.day, cpu: Math.round(30 + point.risk * 6) }));

const columns: DataTableColumn<Ec2Instance>[] = [
  { key: "name", header: "Instance", sortValue: (r) => r.name, render: (r) => <span className="text-text">{r.name}</span> },
  { key: "id", header: "Instance ID" },
  { key: "instanceType", header: "Type" },
  { key: "state", header: "State", render: (r) => <StatusBadge status={r.state} /> },
  { key: "az", header: "Availability Zone" },
  {
    key: "cpu",
    header: "CPU",
    sortValue: (r) => r.cpu,
    render: (r) => (
      <div className="flex items-center gap-2 w-24">
        <div className="h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden">
          <div className="h-full rounded-full gradient-accent" style={{ width: `${r.cpu}%` }} />
        </div>
        <span className="text-xs">{r.cpu}%</span>
      </div>
    ),
  },
  { key: "privateIp", header: "Private IP" },
];

export default function Ec2Monitoring() {
  const [selected, setSelected] = useState<Ec2Instance | null>(null);
  const running = ec2Instances.filter((i) => i.state === "Running").length;
  const avgCpu = Math.round(ec2Instances.reduce((s, i) => s + i.cpu, 0) / ec2Instances.length);

  return (
    <div>
      <PageHeader title="EC2 Monitoring" description="Instance health and utilization across every region. Click an instance for full detail." />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <StatTile icon={LuServer} label="Total Instances" value={String(ec2Instances.length)} />
        <StatTile icon={LuPower} label="Running" value={String(running)} trend={`${ec2Instances.length - running} stopped/pending`} trendPositive />
        <StatTile icon={LuCpu} label="Fleet Avg CPU" value={String(avgCpu)} suffix="%" numeric />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <LiveMetricCard icon={LuCpu} label="CPU Utilization" unit="%" base={avgCpu} jitter={9} />
        <LiveMetricCard icon={LuMemoryStick} label="Memory Usage" unit="%" base={64} jitter={6} />
        <LiveMetricCard icon={LuHardDrive} label="Disk Usage" unit="%" base={48} jitter={4} />
        <LiveMetricCard icon={LuArrowRightLeft} label="Requests / sec" unit="req/s" base={1150} jitter={260} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <ChartCard title="Fleet CPU Utilization — 14 Days" className="lg:col-span-2">
          <TrendAreaChart data={cpuTrend} xKey="day" yKey="cpu" color="#3b82f6" />
        </ChartCard>

        <GlassCard hover={false} className="p-5 sm:p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <LuActivity size={16} className="text-accent-2" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-text">CloudWatch Alarms</h3>
          </div>
          <ul className="space-y-3">
            {cloudwatchAlarms.map((alarm) => (
              <li key={alarm.name} className="flex items-center justify-between text-sm">
                <span className="text-text-muted truncate pr-3">{alarm.name}</span>
                <StatusBadge status={alarm.status} />
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <DataTable
        columns={columns}
        data={ec2Instances}
        rowKey={(row) => row.id}
        searchPlaceholder="Search instances..."
        searchFn={(row, q) => row.name.toLowerCase().includes(q) || row.id.toLowerCase().includes(q)}
        filters={[{ key: "state", label: "State", options: ["Running", "Stopped", "Pending"] }]}
        getFilterValue={(row, key) => (key === "state" ? row.state : "")}
        pageSize={10}
        onRowClick={setSelected}
      />

      <SidePanel
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ""}
        subtitle={selected ? `${selected.id} · ${selected.az}` : undefined}
      >
        {selected && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">State</span>
              <StatusBadge status={selected.state} />
            </div>

            <div>
              <DetailRow label="Instance Type" value={selected.instanceType} />
              <DetailRow label="CPU" value={`${selected.cpu}%`} />
              <DetailRow label="Memory" value={`${selected.memory}%`} />
              <DetailRow label="Private IP" value={selected.privateIp} />
              <DetailRow label="AMI" value={<span className="text-xs">{selected.ami}</span>} />
              <DetailRow label="Key Pair" value={selected.keyPair} />
              <DetailRow label="Launched" value={selected.launched} />
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">Security Groups</h3>
              <div className="flex flex-wrap gap-2">
                {selected.securityGroups.map((sg) => (
                  <span key={sg} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-text-muted">
                    {sg}
                  </span>
                ))}
              </div>
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
              <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(selected.tags).map(([key, value]) => (
                  <span key={key} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-text-muted">
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
