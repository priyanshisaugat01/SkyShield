import type { IconType } from "react-icons";
import { LuShieldAlert, LuBadgeCheck, LuCloud, LuFileCode, LuServerCog } from "react-icons/lu";

export interface OpsMetric {
  icon: IconType;
  label: string;
  value: string;
  trend: string;
  trendPositive: boolean;
}

export const opsMetrics: OpsMetric[] = [
  { icon: LuShieldAlert, label: "Active Threats", value: "23", trend: "-4 today", trendPositive: true },
  { icon: LuBadgeCheck, label: "Compliance Score", value: "94%", trend: "+2% this week", trendPositive: true },
  { icon: LuCloud, label: "AWS Resources Monitored", value: "8,204", trend: "+212 this week", trendPositive: true },
  { icon: LuFileCode, label: "Terraform Checks Passed", value: "156/162", trend: "96% pass rate", trendPositive: true },
  { icon: LuServerCog, label: "Healthy K8s Nodes", value: "18/20", trend: "2 degraded", trendPositive: false },
];

export const dockerBreakdown = [
  { label: "Critical", value: 2, color: "#f87171" },
  { label: "High", value: 3, color: "#fb923c" },
  { label: "Medium", value: 5, color: "#facc15" },
  { label: "Low", value: 2, color: "#22d3ee" },
];

export const cpuSparkline = [38, 42, 40, 47, 44, 52, 49, 55, 51, 46, 42, 45];

export const alertPreview = [
  { severity: "Critical", label: "Root API call outside business hours", color: "#f87171" },
  { severity: "High", label: "New IAM policy grants s3:*", color: "#fb923c" },
  { severity: "Medium", label: "TLS 1.0 still enabled on ALB listener", color: "#facc15" },
];
