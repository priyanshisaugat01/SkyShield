import type { IconType } from "react-icons";
import { LuFileCode, LuContainer, LuServerCog, LuKey, LuNetwork, LuGauge } from "react-icons/lu";

export interface SecurityLayer {
  icon: IconType;
  title: string;
  description: string;
  scanResult: string;
  scanDetail: string;
}

export const securityLayers: SecurityLayer[] = [
  {
    icon: LuFileCode,
    title: "Terraform Scanning",
    description: "Every plan checked against security best practice before anything is provisioned.",
    scanResult: "162 resources scanned",
    scanDetail: "6 misconfigurations found",
  },
  {
    icon: LuContainer,
    title: "Docker Scanning",
    description: "Images scanned for known CVEs across OS packages and application dependencies.",
    scanResult: "48 images scanned",
    scanDetail: "12 vulnerabilities · 2 critical",
  },
  {
    icon: LuServerCog,
    title: "Kubernetes Security",
    description: "Cluster configuration, RBAC, and workload posture assessed continuously.",
    scanResult: "20 nodes assessed",
    scanDetail: "2 RBAC policies flagged",
  },
  {
    icon: LuKey,
    title: "IAM Analysis",
    description: "Least-privilege review across every human and machine identity, cloud-wide.",
    scanResult: "340 identities reviewed",
    scanDetail: "14 over-privileged roles",
  },
  {
    icon: LuNetwork,
    title: "Cloud Misconfiguration Detection",
    description: "Public buckets, open security groups, and exposed services flagged in real time.",
    scanResult: "8,204 resources monitored",
    scanDetail: "3 public-facing exposures",
  },
  {
    icon: LuGauge,
    title: "Risk Scoring",
    description: "Every finding rolled into a single composite score weighted by business impact.",
    scanResult: "Composite risk score",
    scanDetail: "72 / 100 — Medium risk",
  },
];
