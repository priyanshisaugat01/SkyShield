export interface ComplianceFramework {
  name: string;
  score: number;
}

export const complianceFrameworks: ComplianceFramework[] = [
  { name: "SOC 2 Type II", score: 98 },
  { name: "ISO 27001", score: 95 },
  { name: "CIS Benchmarks", score: 91 },
  { name: "NIST CSF", score: 89 },
  { name: "AWS Foundational", score: 97 },
  { name: "PCI DSS", score: 93 },
];
