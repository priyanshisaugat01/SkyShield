export interface Report {
  id: string;
  name: string;
  type: "Compliance" | "Security" | "Infrastructure" | "Executive Summary";
  period: string;
  generated: string;
  format: "PDF" | "CSV" | "JSON";
  status: "Ready" | "Generating";
}

const REPORT_TEMPLATES: [string, Report["type"]][] = [
  ["SOC 2 Type II Evidence Package", "Compliance"],
  ["Monthly Security Findings Summary", "Security"],
  ["Q3 Infrastructure Cost & Utilization", "Infrastructure"],
  ["ISO 27001 Control Mapping", "Compliance"],
  ["Executive Risk Briefing — July", "Executive Summary"],
  ["Container Vulnerability Digest", "Security"],
  ["AWS Foundational Benchmark Results", "Compliance"],
  ["Terraform Change Audit Log", "Infrastructure"],
  ["PCI DSS Quarterly Attestation", "Compliance"],
  ["Kubernetes Cluster Health Report", "Infrastructure"],
];

export const reports: Report[] = REPORT_TEMPLATES.map(([name, type], index) => ({
  id: `rep-${index + 1}`,
  name,
  type,
  period: index % 2 === 0 ? "Jul 2026" : "Q3 2026",
  generated: index === 0 ? "—" : `${(index % 28) + 1}d ago`,
  format: index % 3 === 0 ? "CSV" : "PDF",
  status: index === 0 ? "Generating" : "Ready",
}));
