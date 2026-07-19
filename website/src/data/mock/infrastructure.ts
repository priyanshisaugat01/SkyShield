export interface VpcSummary {
  id: string;
  name: string;
  region: string;
  cidr: string;
  subnets: number;
  instances: number;
  status: "Healthy" | "Degraded";
}

export const vpcs: VpcSummary[] = [
  { id: "vpc-1", name: "core-network-vpc", region: "us-east-1", cidr: "10.0.0.0/16", subnets: 6, instances: 24, status: "Healthy" },
  { id: "vpc-2", name: "ops-network-vpc", region: "us-west-2", cidr: "10.1.0.0/16", subnets: 4, instances: 12, status: "Healthy" },
  { id: "vpc-3", name: "eu-network-vpc", region: "eu-west-1", cidr: "10.2.0.0/16", subnets: 4, instances: 9, status: "Degraded" },
  { id: "vpc-4", name: "staging-vpc", region: "us-east-1", cidr: "10.3.0.0/16", subnets: 2, instances: 5, status: "Healthy" },
];

export const resourceByType = [
  { name: "EC2", value: 15, color: "#3b82f6" },
  { name: "S3", value: 12, color: "#22d3ee" },
  { name: "Lambda", value: 18, color: "#818cf8" },
  { name: "RDS", value: 4, color: "#fb923c" },
  { name: "Other", value: 9, color: "#94a3b8" },
];

export const regions = [
  { name: "us-east-1", resources: 34, label: "N. Virginia" },
  { name: "us-west-2", resources: 18, label: "Oregon" },
  { name: "eu-west-1", resources: 14, label: "Ireland" },
  { name: "ap-southeast-1", resources: 6, label: "Singapore" },
];
