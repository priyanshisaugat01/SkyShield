export type EventSeverity = "critical" | "high" | "medium" | "low" | "info";

export interface LiveEvent {
  id: string;
  severity: EventSeverity;
  message: string;
  resource: string;
}

export const SEVERITY_COLOR: Record<EventSeverity, string> = {
  critical: "#f87171",
  high: "#fb923c",
  medium: "#facc15",
  low: "#22d3ee",
  info: "#94a3b8",
};

// A rotating pool the live feed draws from to simulate a real stream —
// deterministic content, non-deterministic timing/order.
export const EVENT_POOL: Omit<LiveEvent, "id">[] = [
  { severity: "critical", message: "Public S3 bucket policy detected", resource: "prod-assets-bucket" },
  { severity: "high", message: "IAM role created with wildcard permissions", resource: "svc-billing-role" },
  { severity: "medium", message: "Security group opened on port 22", resource: "vpc-web-sg" },
  { severity: "low", message: "Access key unused for 90+ days", resource: "iam-user-ci-bot" },
  { severity: "info", message: "Terraform plan applied successfully", resource: "infra/terraform" },
  { severity: "high", message: "Container image with 3 critical CVEs pushed", resource: "ecr/skyshield-demo-app" },
  { severity: "medium", message: "Kubernetes pod running as root", resource: "eks/checkout-service" },
  { severity: "critical", message: "Root account API call detected", resource: "org-root-783954" },
  { severity: "info", message: "Compliance evidence snapshot generated", resource: "soc2-evidence-bundle" },
  { severity: "low", message: "CloudWatch alarm threshold adjusted", resource: "cpu-utilization-alarm" },
  { severity: "medium", message: "New secret pattern matched in commit", resource: "github/skyshield-services" },
  { severity: "high", message: "Anomalous API call volume from new region", resource: "iam-user-data-pipeline" },
  { severity: "info", message: "Terraform apply completed", resource: "infra/networking" },
  { severity: "high", message: "CloudWatch alert triggered — disk space utilization", resource: "prod-checkin-api-01" },
  { severity: "info", message: "Checkov scan passed — 0 misconfigurations", resource: "infra/ec2" },
  { severity: "critical", message: "Trivy found 2 critical CVEs", resource: "ecr/checkout-service" },
  { severity: "medium", message: "EC2 instance restarted", resource: "flight-ops-worker-02" },
  { severity: "medium", message: "IAM policy updated", resource: "svc-deploy-role" },
  { severity: "info", message: "New deployment completed", resource: "pl-2011 · boarding-pass-service" },
  { severity: "low", message: "Kubernetes pod restarted", resource: "eks/gate-assignment-api" },
  { severity: "info", message: "Compliance scan finished — 94% posture", resource: "soc2-evidence-bundle" },
];
