export interface CloudWatchAlarm {
  name: string;
  status: "OK" | "ALARM";
}

export const cloudwatchAlarms: CloudWatchAlarm[] = [
  { name: "cpu-utilization-alarm", status: "OK" },
  { name: "5xx-error-rate", status: "OK" },
  { name: "rds-connection-count", status: "OK" },
  { name: "disk-space-utilization", status: "ALARM" },
];

export interface QuickActionConfig {
  id: string;
  label: string;
  loadingLabel: string;
  successLabel: string;
}

export const quickActions: QuickActionConfig[] = [
  { id: "compliance", label: "Run Compliance Scan", loadingLabel: "Scanning controls...", successLabel: "Compliance scan complete" },
  { id: "terraform", label: "Scan Terraform", loadingLabel: "Running Checkov...", successLabel: "0 new misconfigurations" },
  { id: "docker", label: "Scan Docker Images", loadingLabel: "Scanning images...", successLabel: "2 new CVEs found" },
  { id: "report", label: "Generate Report", loadingLabel: "Generating PDF...", successLabel: "Report ready to download" },
];
