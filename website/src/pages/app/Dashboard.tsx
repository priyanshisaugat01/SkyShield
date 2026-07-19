import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LuShieldAlert,
  LuBadgeCheck,
  LuCloud,
  LuServerCog,
  LuServer,
  LuNetwork,
  LuContainer,
  LuHeartPulse,
  LuGauge,
  LuCpu,
  LuMemoryStick,
  LuArrowRightLeft,
  LuTimer,
  LuActivity,
  LuScanLine,
  LuFileCode,
  LuFileDown,
  LuCircleCheck,
  LuLoaderCircle,
  LuRefreshCw,
  LuFlame,
  LuBoxes,
} from "react-icons/lu";
import PageHeader from "../../components/app/PageHeader";
import StatTile from "../../components/app/StatTile";
import ChartCard from "../../components/app/ChartCard";
import TrendAreaChart from "../../components/app/charts/TrendAreaChart";
import SeverityBarChart from "../../components/app/charts/SeverityBarChart";
import DonutChart from "../../components/app/charts/DonutChart";
import DataTable, { type DataTableColumn } from "../../components/app/DataTable";
import StatusBadge from "../../components/app/StatusBadge";
import GlassCard from "../../components/ui/GlassCard";
import LiveMetricCard from "../../components/effects/LiveMetricCard";
import LiveActivityFeed from "../../components/effects/LiveActivityFeed";
import { riskTrend, findingsBySeverity } from "../../data/mock/trends";
import { resourceByType, vpcs } from "../../data/mock/infrastructure";
import { findings, type Finding } from "../../data/mock/findings";
import { ec2Instances } from "../../data/mock/ec2Instances";
import { k8sClusters, k8sResourceCounts } from "../../data/mock/kubernetes";
import { containerImages } from "../../data/mock/containers";
import { terraformRuns, terraformModules } from "../../data/mock/terraformRuns";
import { cloudwatchAlarms, quickActions, type QuickActionConfig } from "../../data/mock/dashboardOps";
import { useToast } from "../../context/ToastContext";

const columns: DataTableColumn<Finding>[] = [
  {
    key: "severity",
    header: "Severity",
    sortValue: (row) => ({ Critical: 3, High: 2, Medium: 1, Low: 0 })[row.severity],
    render: (row) => <StatusBadge status={row.severity} />,
  },
  { key: "title", header: "Finding", render: (row) => <span className="text-text">{row.title}</span> },
  { key: "resource", header: "Resource" },
  { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
  { key: "discovered", header: "Discovered" },
];

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`rounded-2xl bg-white/[0.03] border border-white/10 animate-pulse ${className}`} />;
}

const ACTION_ICONS: Record<string, typeof LuBadgeCheck> = {
  compliance: LuBadgeCheck,
  terraform: LuFileCode,
  docker: LuContainer,
  report: LuFileDown,
};

function QuickActionButton({ action, onDone }: { action: QuickActionConfig; onDone: (action: QuickActionConfig) => void }) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const IdleIcon = ACTION_ICONS[action.id] ?? LuScanLine;

  function handleClick() {
    if (state !== "idle") return;
    setState("loading");
    setTimeout(() => {
      setState("done");
      onDone(action);
      setTimeout(() => setState("idle"), 2200);
    }, 1500 + Math.random() * 500);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={state !== "idle"}
      className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-text-muted transition-all hover:border-accent/40 hover:text-text hover:bg-white/5 disabled:hover:border-white/10 disabled:cursor-default"
    >
      {state === "idle" && <IdleIcon size={15} className="text-accent-2" aria-hidden="true" />}
      {state === "loading" && <LuLoaderCircle size={15} className="text-accent-2 animate-spin" aria-hidden="true" />}
      {state === "done" && <LuCircleCheck size={15} className="text-accent-2" aria-hidden="true" />}
      <span className="whitespace-nowrap">
        {state === "idle" && action.label}
        {state === "loading" && action.loadingLabel}
        {state === "done" && action.successLabel}
      </span>
    </button>
  );
}

export default function Dashboard() {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  function handleActionDone(action: QuickActionConfig) {
    showToast({ tone: "success", title: action.successLabel, description: action.label });
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 650);
    return () => clearTimeout(timer);
  }, []);

  function handleRefresh() {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 650);
  }

  const recentFindings = findings.slice(0, 6);

  const ec2Running = ec2Instances.filter((i) => i.state === "Running").length;
  const k8sHealthy = k8sClusters.reduce((s, c) => s + c.nodesHealthy, 0);
  const k8sTotal = k8sClusters.reduce((s, c) => s + c.nodesTotal, 0);
  const vpcHealthy = vpcs.filter((v) => v.status === "Healthy").length;
  const containersClean = containerImages.filter((img) => img.critical + img.high + img.medium + img.low === 0).length;

  const infraCategories = [
    { label: "Compute (EC2)", icon: LuServer, healthy: ec2Running, total: ec2Instances.length },
    { label: "Kubernetes Nodes", icon: LuServerCog, healthy: k8sHealthy, total: k8sTotal },
    { label: "Networking (VPC)", icon: LuNetwork, healthy: vpcHealthy, total: vpcs.length },
    { label: "Container Images", icon: LuContainer, healthy: containersClean, total: containerImages.length },
  ];
  const infraHealthPct = Math.round(
    (infraCategories.reduce((s, c) => s + c.healthy / c.total, 0) / infraCategories.length) * 100
  );

  const riskScore = riskTrend[riskTrend.length - 1].risk;
  const riskLabel = riskScore <= 3.5 ? "Low Risk" : riskScore <= 6.5 ? "Medium Risk" : "High Risk";
  const riskColor = riskScore <= 3.5 ? "#22d3ee" : riskScore <= 6.5 ? "#facc15" : "#f87171";

  // Seed the live metric sparklines with a plausible curve derived from the
  // risk trend so they render populated immediately, instead of a flat line
  // until the first live tick fires a couple seconds after mount.
  const cpuSeed = riskTrend.map((p) => Math.round(35 + p.risk * 6));
  const memSeed = riskTrend.map((p) => Math.round(55 + p.risk * 3));
  const netSeed = riskTrend.map((p) => Math.round(70 + p.risk * 8));
  const latencySeed = riskTrend.map((p) => Math.round(120 + p.risk * 12));

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Real-time overview of your aviation cloud security posture."
        actions={
          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-2 text-xs text-text-muted hover:text-text transition-colors"
          >
            <LuRefreshCw size={13} className={isLoading ? "animate-spin" : ""} aria-hidden="true" />
            {isLoading ? "Refreshing..." : "Last updated: just now"}
          </button>
        }
      />

      {/* Quick Actions */}
      <GlassCard hover={false} className="p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-text-muted mr-1">Quick Actions</span>
          {quickActions.map((action) => (
            <QuickActionButton key={action.id} action={action} onDone={handleActionDone} />
          ))}
        </div>
      </GlassCard>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div key="skeleton" exit={{ opacity: 0 }} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-[104px]" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <Skeleton className="h-[280px] lg:col-span-2" />
              <Skeleton className="h-[280px]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[150px]" />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
            {/* Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-5">
              <StatTile icon={LuHeartPulse} label="Infrastructure Health" value={String(infraHealthPct)} suffix="%" numeric trend="all systems reporting" trendPositive />
              <StatTile icon={LuBadgeCheck} label="Compliance Score" value="94" suffix="%" trend="+2% wk" trendPositive numeric />
              <StatTile icon={LuGauge} label="Security Risk Score" value={`${riskScore.toFixed(1)}/10`} trend={riskLabel} trendPositive={riskScore <= 3.5} />
              <StatTile icon={LuShieldAlert} label="Active Threats" value="23" trend="-4 today" trendPositive numeric />
              <StatTile icon={LuCloud} label="Running AWS Resources" value={`${ec2Running}/${ec2Instances.length}`} trend="EC2 instances" trendPositive />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <StatTile
                icon={LuFlame}
                label="Critical Findings"
                value={String(findings.filter((f) => f.severity === "Critical").length)}
                trendPositive={false}
                trend="needs immediate triage"
              />
              <StatTile icon={LuBoxes} label="Running Containers" value={String(k8sResourceCounts.pods)} trend={`${k8sClusters.length} clusters`} trendPositive />
            </div>

            {/* Risk trend + Cloud resource summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
              <ChartCard title="Risk Trend — 14 Days" description="Composite risk score across your environment" className="lg:col-span-2">
                <TrendAreaChart data={riskTrend} xKey="day" yKey="risk" color={riskColor} />
              </ChartCard>
              <ChartCard title="Cloud Resource Summary" description="8,204 monitored assets">
                <DonutChart data={resourceByType} centerValue="8,204" centerLabel="Resources" />
              </ChartCard>
            </div>

            {/* Live telemetry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              <LiveMetricCard icon={LuCpu} label="CPU Utilization" unit="%" base={45} jitter={10} seedTrend={cpuSeed} />
              <LiveMetricCard icon={LuMemoryStick} label="Memory Usage" unit="%" base={62} jitter={7} seedTrend={memSeed} />
              <LiveMetricCard icon={LuArrowRightLeft} label="Network Throughput" unit="MB/s" base={84} jitter={22} decimals={1} seedTrend={netSeed} />
              <LiveMetricCard icon={LuTimer} label="P99 Latency" unit="ms" base={145} jitter={35} seedTrend={latencySeed} />
            </div>

            {/* Kubernetes + Terraform status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
              <GlassCard hover={false} className="p-5 sm:p-6">
                <h3 className="text-sm font-semibold text-text mb-4">Kubernetes Cluster Health</h3>
                <div className="space-y-4">
                  {k8sClusters.map((cluster) => (
                    <div key={cluster.id}>
                      <div className="flex items-center justify-between mb-1.5 text-sm">
                        <span className="text-text-muted">
                          {cluster.name} <span className="text-text-muted/60">v{cluster.version}</span>
                        </span>
                        <StatusBadge status={cluster.status} />
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${cluster.status === "Healthy" ? "gradient-accent" : "bg-amber-400"}`}
                          style={{ width: `${(cluster.nodesHealthy / cluster.nodesTotal) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-text-muted">{k8sResourceCounts.pods} pods running across {k8sClusters.length} clusters</p>
              </GlassCard>

              <GlassCard hover={false} className="p-5 sm:p-6">
                <h3 className="text-sm font-semibold text-text mb-4">Terraform Status</h3>
                {(() => {
                  const latest = terraformRuns[0];
                  const avgScore = Math.round(terraformModules.reduce((s, m) => s + m.securityScore, 0) / terraformModules.length);
                  const drifted = terraformModules.filter((m) => m.drift).length;
                  return (
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-text-muted">Latest run</span>
                        <span className="text-text">{latest.id} · {latest.workspace}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-muted">Status</span>
                        <StatusBadge status={latest.status} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-muted">Security score</span>
                        <span className="text-text">{avgScore}/100</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-muted">Modules with drift</span>
                        <span className={drifted > 0 ? "text-amber-400" : "text-accent-2"}>{drifted}</span>
                      </div>
                    </div>
                  );
                })()}
              </GlassCard>
            </div>

            {/* Infrastructure health breakdown + CloudWatch + Live activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
              <GlassCard hover={false} className="p-5 sm:p-6">
                <h3 className="text-sm font-semibold text-text mb-4">Infrastructure Health</h3>
                <div className="space-y-4">
                  {infraCategories.map((cat) => (
                    <div key={cat.label}>
                      <div className="flex items-center justify-between mb-1.5 text-sm">
                        <span className="flex items-center gap-2 text-text-muted">
                          <cat.icon size={14} className="text-accent-2" aria-hidden="true" />
                          {cat.label}
                        </span>
                        <span className="text-text">
                          {cat.healthy}/{cat.total}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${cat.healthy === cat.total ? "gradient-accent" : "bg-amber-400"}`}
                          style={{ width: `${(cat.healthy / cat.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

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

              <GlassCard hover={false} className="overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                  <p className="text-sm font-semibold text-text">Live Activity Feed</p>
                  <span className="flex items-center gap-1.5 text-xs text-accent-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-2 animate-pulse" aria-hidden="true" />
                    Streaming
                  </span>
                </div>
                <div className="max-h-[268px] overflow-y-auto">
                  <LiveActivityFeed />
                </div>
              </GlassCard>
            </div>

            {/* Findings */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
              <ChartCard title="Open Findings by Severity" className="lg:col-span-1">
                <SeverityBarChart data={findingsBySeverity} height={200} />
              </ChartCard>
              <GlassCard hover={false} className="lg:col-span-2 p-5 sm:p-6">
                <h3 className="text-sm font-semibold text-text mb-4">Recent Security Findings</h3>
                <div className="divide-y divide-white/5">
                  {recentFindings.map((finding) => (
                    <div key={finding.id} className="flex items-center gap-3 py-2.5 text-sm">
                      <StatusBadge status={finding.severity} />
                      <span className="flex-1 min-w-0 truncate text-text">{finding.title}</span>
                      <span className="hidden sm:block text-xs text-text-muted shrink-0">{finding.discovered}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            <DataTable
              columns={columns}
              data={findings}
              rowKey={(row) => row.id}
              searchPlaceholder="Search findings..."
              searchFn={(row, q) => row.title.toLowerCase().includes(q) || row.resource.toLowerCase().includes(q)}
              filters={[{ key: "severity", label: "Severity", options: ["Critical", "High", "Medium", "Low"] }]}
              getFilterValue={(row, key) => (key === "severity" ? row.severity : "")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
