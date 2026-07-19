export interface AwsResource {
  id: string;
  name: string;
  type: "EC2" | "S3" | "Lambda" | "RDS" | "VPC" | "IAM Role" | "ECS" | "CloudFront" | "DynamoDB";
  region: string;
  status: "Healthy" | "Degraded" | "Critical";
  monthlyCost: number;
  lastModified: string;
  arn: string;
  security: string;
  configuration: string;
  recentEvents: string[];
  tags: Record<string, string>;
}

const NAMES: [string, AwsResource["type"]][] = [
  ["prod-checkin-api", "EC2"],
  ["prod-assets-bucket", "S3"],
  ["flight-ops-processor", "Lambda"],
  ["passenger-db-primary", "RDS"],
  ["core-network-vpc", "VPC"],
  ["svc-billing-role", "IAM Role"],
  ["checkout-service", "ECS"],
  ["static-site-dist", "CloudFront"],
  ["session-cache-table", "DynamoDB"],
  ["baggage-tracking-api", "EC2"],
  ["compliance-evidence-bucket", "S3"],
  ["crew-scheduling-fn", "Lambda"],
  ["maintenance-log-db", "RDS"],
  ["ops-network-vpc", "VPC"],
  ["svc-deploy-role", "IAM Role"],
  ["boarding-pass-service", "ECS"],
  ["docs-cdn-dist", "CloudFront"],
  ["rate-limit-table", "DynamoDB"],
  ["gate-assignment-api", "EC2"],
  ["log-archive-bucket", "S3"],
  ["weather-ingest-fn", "Lambda"],
  ["analytics-db-replica", "RDS"],
];

const REGIONS = ["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1"];
const STATUSES: AwsResource["status"][] = ["Healthy", "Healthy", "Healthy", "Degraded", "Critical"];

const SECURITY_BY_TYPE: Record<AwsResource["type"], string> = {
  EC2: "IMDSv2 enforced, security group restricts inbound to ALB only.",
  S3: "Block Public Access enabled, SSE-S3 encryption, versioning on.",
  Lambda: "Execution role scoped to required actions, environment variables encrypted with KMS.",
  RDS: "Encrypted at rest, no public accessibility, automated backups enabled.",
  VPC: "Default deny-all NACLs, flow logs streaming to CloudWatch.",
  "IAM Role": "Trust policy scoped to specific principals, permissions boundary attached.",
  ECS: "Task role follows least privilege, awsvpc network mode with private subnets.",
  CloudFront: "TLS 1.2+ enforced, WAF attached, signed URLs for private content.",
  DynamoDB: "Encryption at rest with AWS managed key, point-in-time recovery enabled.",
};

const CONFIG_BY_TYPE: Record<AwsResource["type"], string> = {
  EC2: "On-demand instance, auto-recovery enabled, CloudWatch detailed monitoring on.",
  S3: "Lifecycle policy archives objects to Glacier after 90 days.",
  Lambda: "Memory: 512MB, timeout: 30s, provisioned concurrency: 2.",
  RDS: "Multi-AZ standby, automated minor version upgrades enabled.",
  VPC: "6 subnets across 3 AZs, 1 NAT gateway.",
  "IAM Role": "Attached to 1 service, last used 2h ago.",
  ECS: "Fargate launch type, 2 tasks desired, auto-scaling 2-6.",
  CloudFront: "Origin failover configured, compression enabled.",
  DynamoDB: "On-demand capacity mode, global secondary index on 2 attributes.",
};

export const awsResources: AwsResource[] = NAMES.map(([name, type], index) => {
  const region = REGIONS[index % REGIONS.length];
  return {
    id: `res-${(index + 1).toString().padStart(3, "0")}`,
    name,
    type,
    region,
    status: STATUSES[(index * 3) % STATUSES.length],
    monthlyCost: Math.round((80 + ((index * 137) % 900)) * 1.0),
    lastModified: `${(index % 27) + 1}d ago`,
    arn: `arn:aws:${type.toLowerCase().replace(" ", "")}:${region}:783954203415:${name}`,
    security: SECURITY_BY_TYPE[type],
    configuration: CONFIG_BY_TYPE[type],
    recentEvents: [
      `Health check passed — ${(index % 12) + 1}h ago`,
      index % 4 === 0 ? "Configuration updated by ci-bot" : "No configuration changes in 7 days",
    ],
    tags: { env: "prod", owner: index % 2 === 0 ? "platform-team" : "security-team" },
  };
});
