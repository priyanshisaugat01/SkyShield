export interface ThreatIncident {
  id: string;
  severity: "critical" | "high" | "medium";
  title: string;
  resource: string;
  time: string;
}

export const threatTimeline: ThreatIncident[] = [
  { id: "t1", severity: "critical", title: "Anomalous data exfiltration pattern detected", resource: "s3://prod-assets-bucket", time: "3m ago" },
  { id: "t2", severity: "high", title: "Credential stuffing attack mitigated", resource: "auth.skyshield.io", time: "22m ago" },
  { id: "t3", severity: "high", title: "Suspicious lateral movement flagged", resource: "vpc-internal-prod", time: "1h ago" },
  { id: "t4", severity: "medium", title: "Unusual privilege escalation blocked", resource: "iam-role/svc-deploy", time: "3h ago" },
  { id: "t5", severity: "medium", title: "Brute-force login attempt blocked", resource: "bastion-host-eu", time: "6h ago" },
];

export const incidentCards: ThreatIncident[] = [
  { id: "i1", severity: "critical", title: "Root credentials used outside approved IP range", resource: "org-root-783954", time: "8m ago" },
  { id: "i2", severity: "high", title: "New security group rule opens 0.0.0.0/0 on port 3389", resource: "vpc-web-sg", time: "35m ago" },
  { id: "i3", severity: "medium", title: "Container registry pulled from unrecognized network", resource: "ecr/skyshield-demo-app", time: "2h ago" },
];

// Rows = threat category, columns = last 7 days, values = relative intensity 0-4.
export const heatmapCategories = ["Identity", "Network", "Data", "Compute", "Container"];
export const heatmapData: number[][] = [
  [1, 2, 1, 3, 2, 4, 2],
  [0, 1, 2, 1, 3, 2, 1],
  [2, 1, 1, 0, 1, 2, 3],
  [1, 0, 2, 2, 1, 1, 0],
  [0, 2, 1, 1, 2, 3, 2],
];

export const riskTrend = [6.1, 5.8, 6.4, 5.9, 5.2, 4.8, 4.6, 4.9, 4.3, 3.9, 3.6, 3.4, 3.2, 3.2];
