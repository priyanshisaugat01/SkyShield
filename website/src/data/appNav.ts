import type { IconType } from "react-icons";
import {
  LuLayoutDashboard,
  LuNetwork,
  LuCloud,
  LuServer,
  LuServerCog,
  LuContainer,
  LuFileCode,
  LuWorkflow,
  LuBadgeCheck,
  LuShieldAlert,
  LuFileText,
  LuUsers,
  LuSettings,
  LuSparkles,
} from "react-icons/lu";

export interface AppNavItem {
  label: string;
  path: string;
  icon: IconType;
}

export interface AppNavGroup {
  heading: string;
  items: AppNavItem[];
}

export const appNavGroups: AppNavGroup[] = [
  {
    heading: "Overview",
    items: [{ label: "Dashboard", path: "/app", icon: LuLayoutDashboard }],
  },
  {
    heading: "Infrastructure",
    items: [
      { label: "Infrastructure", path: "/app/infrastructure", icon: LuNetwork },
      { label: "AWS Resources", path: "/app/aws-resources", icon: LuCloud },
      { label: "EC2 Monitoring", path: "/app/ec2", icon: LuServer },
      { label: "Kubernetes", path: "/app/kubernetes", icon: LuServerCog },
      { label: "Containers", path: "/app/containers", icon: LuContainer },
      { label: "Terraform", path: "/app/terraform", icon: LuFileCode },
    ],
  },
  {
    heading: "Security & Compliance",
    items: [
      { label: "DevSecOps Pipelines", path: "/app/pipelines", icon: LuWorkflow },
      { label: "Compliance Center", path: "/app/compliance", icon: LuBadgeCheck },
      { label: "Security Findings", path: "/app/findings", icon: LuShieldAlert },
      { label: "AI Security Assistant", path: "/app/assistant", icon: LuSparkles },
    ],
  },
  {
    heading: "Workspace",
    items: [
      { label: "Reports", path: "/app/reports", icon: LuFileText },
      { label: "Team Management", path: "/app/team", icon: LuUsers },
      { label: "Settings", path: "/app/settings", icon: LuSettings },
    ],
  },
];
