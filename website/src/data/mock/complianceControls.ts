export interface ComplianceControl {
  id: string;
  framework: "SOC 2 Type II" | "ISO 27001" | "CIS Benchmarks" | "NIST CSF" | "AWS Foundational" | "PCI DSS";
  control: string;
  status: "Compliant" | "Non-Compliant" | "In Review";
  lastChecked: string;
}

const CONTROLS: [ComplianceControl["framework"], string][] = [
  ["SOC 2 Type II", "Logical access controls restrict production systems"],
  ["SOC 2 Type II", "Encryption at rest enabled for all data stores"],
  ["SOC 2 Type II", "Change management requires peer review"],
  ["ISO 27001", "A.8.24 — Use of cryptography"],
  ["ISO 27001", "A.5.15 — Access control policy documented"],
  ["ISO 27001", "A.8.16 — Monitoring activities logged and retained"],
  ["CIS Benchmarks", "1.4 — Ensure IAM root user access key does not exist"],
  ["CIS Benchmarks", "2.1.1 — S3 bucket encryption enabled"],
  ["CIS Benchmarks", "5.2 — Security groups restrict SSH access"],
  ["NIST CSF", "PR.AC-4 — Access permissions managed with least privilege"],
  ["NIST CSF", "DE.CM-1 — Network monitored for anomalies"],
  ["AWS Foundational", "IAM.1 — IAM policies attached only to groups/roles"],
  ["AWS Foundational", "S3.1 — Block Public Access enabled by default"],
  ["AWS Foundational", "EC2.2 — VPC default security group restricts traffic"],
  ["PCI DSS", "Req 3 — Cardholder data encrypted at rest"],
  ["PCI DSS", "Req 10 — Audit trails for all system access"],
  ["PCI DSS", "Req 11 — Quarterly vulnerability scans performed"],
];

const STATUSES: ComplianceControl["status"][] = ["Compliant", "Compliant", "Compliant", "In Review", "Non-Compliant"];

export const complianceControls: ComplianceControl[] = CONTROLS.map(([framework, control], index) => ({
  id: `ctrl-${index + 1}`,
  framework,
  control,
  status: STATUSES[(index * 3) % STATUSES.length],
  lastChecked: `${(index % 14) + 1}d ago`,
}));

export interface ComplianceScan {
  id: string;
  frameworks: string;
  passed: number;
  failed: number;
  triggeredBy: string;
  timestamp: string;
}

export const complianceScanHistory: ComplianceScan[] = [
  { id: "scan-108", frameworks: "All frameworks", passed: 14, failed: 3, triggeredBy: "Scheduled", timestamp: "2h ago" },
  { id: "scan-107", frameworks: "SOC 2 Type II, PCI DSS", passed: 6, failed: 0, triggeredBy: "Priyanshi S.", timestamp: "1d ago" },
  { id: "scan-106", frameworks: "All frameworks", passed: 13, failed: 4, triggeredBy: "Scheduled", timestamp: "2d ago" },
  { id: "scan-105", frameworks: "AWS Foundational", passed: 3, failed: 0, triggeredBy: "Alex Rivera", timestamp: "4d ago" },
  { id: "scan-104", frameworks: "All frameworks", passed: 12, failed: 5, triggeredBy: "Scheduled", timestamp: "6d ago" },
  { id: "scan-103", frameworks: "ISO 27001, NIST CSF", passed: 5, failed: 1, triggeredBy: "Daniel Okafor", timestamp: "8d ago" },
];
