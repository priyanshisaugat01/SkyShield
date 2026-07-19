export interface TerraformRun {
  id: string;
  workspace: string;
  status: "Applied" | "Planned" | "Failed";
  resourcesChanged: number;
  checkovFindings: number;
  triggeredBy: string;
  timestamp: string;
  checkovDetails: string[];
}

const WORKSPACES = [
  "infra/networking",
  "infra/ec2",
  "infra/s3",
  "infra/iam",
  "infra/eks",
  "infra/rds",
];

const AUTHORS = ["priyanshi.s", "ci-bot", "j.martinez", "a.chen", "ci-bot", "d.okafor"];
const STATUSES: TerraformRun["status"][] = ["Applied", "Applied", "Applied", "Planned", "Failed"];

const CHECKOV_FINDING_POOL = [
  "CKV_AWS_23: Security group rule missing description",
  "CKV_AWS_79: EC2 instance metadata service v1 still allowed",
  "CKV_AWS_18: S3 bucket access logging not enabled",
  "CKV_AWS_144: S3 bucket cross-region replication not enabled",
];

export const terraformRuns: TerraformRun[] = Array.from({ length: 16 }, (_, index) => {
  const checkovFindings = index % 6 === 0 ? 2 + (index % 3) : 0;
  return {
    id: `run-${(1000 + index).toString()}`,
    workspace: WORKSPACES[index % WORKSPACES.length],
    status: STATUSES[(index * 3) % STATUSES.length],
    resourcesChanged: (index * 3) % 14,
    checkovFindings,
    triggeredBy: AUTHORS[index % AUTHORS.length],
    timestamp: `${(index % 30) + 1}d ago`,
    checkovDetails: Array.from({ length: checkovFindings }, (_, i) => CHECKOV_FINDING_POOL[i % CHECKOV_FINDING_POOL.length]),
  };
});

export interface TerraformModule {
  id: string;
  name: string;
  resources: number;
  variables: number;
  outputs: number;
  lastApplied: string;
  drift: boolean;
  securityScore: number;
  resourceTypes: string[];
  driftDetail: string | null;
}

export const terraformModules: TerraformModule[] = [
  {
    id: "mod-1",
    name: "networking",
    resources: 12,
    variables: 6,
    outputs: 5,
    lastApplied: "2d ago",
    drift: false,
    securityScore: 96,
    resourceTypes: ["aws_vpc", "aws_subnet", "aws_internet_gateway", "aws_route_table"],
    driftDetail: null,
  },
  {
    id: "mod-2",
    name: "ec2",
    resources: 15,
    variables: 8,
    outputs: 3,
    lastApplied: "1d ago",
    drift: true,
    securityScore: 88,
    resourceTypes: ["aws_instance", "aws_security_group", "aws_key_pair"],
    driftDetail: "Instance i-0a3f8b21 has a manually-attached security group not present in state.",
  },
  {
    id: "mod-3",
    name: "s3",
    resources: 5,
    variables: 4,
    outputs: 2,
    lastApplied: "6d ago",
    drift: false,
    securityScore: 99,
    resourceTypes: ["aws_s3_bucket", "aws_s3_bucket_public_access_block", "aws_s3_bucket_versioning"],
    driftDetail: null,
  },
  {
    id: "mod-4",
    name: "iam",
    resources: 9,
    variables: 3,
    outputs: 4,
    lastApplied: "4d ago",
    drift: false,
    securityScore: 92,
    resourceTypes: ["aws_iam_role", "aws_iam_policy", "aws_iam_role_policy_attachment"],
    driftDetail: null,
  },
  {
    id: "mod-5",
    name: "eks",
    resources: 18,
    variables: 11,
    outputs: 6,
    lastApplied: "12h ago",
    drift: true,
    securityScore: 84,
    resourceTypes: ["aws_eks_cluster", "aws_eks_node_group", "aws_iam_openid_connect_provider"],
    driftDetail: "Node group desired_size changed from 20 to 18 outside of Terraform (likely cluster autoscaler).",
  },
  {
    id: "mod-6",
    name: "rds",
    resources: 6,
    variables: 5,
    outputs: 3,
    lastApplied: "8d ago",
    drift: false,
    securityScore: 97,
    resourceTypes: ["aws_db_instance", "aws_db_subnet_group", "aws_db_parameter_group"],
    driftDetail: null,
  },
];
