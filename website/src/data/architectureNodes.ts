import type { IconType } from "react-icons";
import {
  LuCompass,
  LuZap,
  LuShuffle,
  LuServer,
  LuBoxes,
  LuDatabase,
  LuFileCode,
  LuActivity,
  LuLock,
} from "react-icons/lu";

export interface ArchNode {
  id: string;
  label: string;
  icon: IconType;
  x: number;
  y: number;
  kind: "edge" | "compute" | "data" | "governance";
}

export interface ArchEdge {
  from: string;
  to: string;
  variant: "flow" | "governance";
}

export const architectureNodes: ArchNode[] = [
  { id: "route53", label: "Route53", icon: LuCompass, x: 8, y: 12, kind: "edge" },
  { id: "cloudfront", label: "CloudFront", icon: LuZap, x: 30, y: 12, kind: "edge" },
  { id: "alb", label: "ALB", icon: LuShuffle, x: 52, y: 12, kind: "edge" },
  { id: "ec2", label: "EC2", icon: LuServer, x: 30, y: 46, kind: "compute" },
  { id: "ecs", label: "ECS", icon: LuBoxes, x: 52, y: 46, kind: "compute" },
  { id: "lambda", label: "Lambda", icon: LuZap, x: 74, y: 46, kind: "compute" },
  { id: "s3", label: "S3", icon: LuDatabase, x: 52, y: 80, kind: "data" },
  { id: "terraform", label: "Terraform", icon: LuFileCode, x: 10, y: 80, kind: "governance" },
  { id: "cloudwatch", label: "CloudWatch", icon: LuActivity, x: 90, y: 12, kind: "governance" },
  { id: "iam", label: "IAM", icon: LuLock, x: 90, y: 80, kind: "governance" },
];

export const architectureEdges: ArchEdge[] = [
  { from: "route53", to: "cloudfront", variant: "flow" },
  { from: "cloudfront", to: "alb", variant: "flow" },
  { from: "alb", to: "ec2", variant: "flow" },
  { from: "alb", to: "ecs", variant: "flow" },
  { from: "alb", to: "lambda", variant: "flow" },
  { from: "ec2", to: "s3", variant: "flow" },
  { from: "ecs", to: "s3", variant: "flow" },
  { from: "lambda", to: "s3", variant: "flow" },
  { from: "terraform", to: "ec2", variant: "governance" },
  { from: "cloudwatch", to: "ecs", variant: "governance" },
  { from: "iam", to: "lambda", variant: "governance" },
  { from: "iam", to: "s3", variant: "governance" },
];
