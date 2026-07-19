export interface FindingTimelineEntry {
  label: string;
  time: string;
}

export interface Finding {
  id: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  title: string;
  resource: string;
  category: "IAM" | "Network" | "Data" | "Compute" | "Container" | "Compliance";
  status: "Open" | "In Progress" | "Resolved";
  assignee: string;
  discovered: string;
  affectedService: string;
  recommendation: string;
  fixSteps: string[];
  timeline: FindingTimelineEntry[];
}

const FINDING_TEMPLATES: [
  Finding["severity"],
  string,
  string,
  Finding["category"],
  string,
  string,
  string[],
][] = [
  [
    "Critical",
    "Public S3 bucket policy detected",
    "prod-assets-bucket",
    "Data",
    "S3",
    "Restrict Block Public Access on this bucket immediately — no legitimate workload requires public write access.",
    ["Open the bucket in AWS Console", "Enable all four Block Public Access settings", "Review bucket policy for public principals", "Re-run the misconfiguration scan to confirm"],
  ],
  [
    "Critical",
    "Root credentials used outside approved IP range",
    "org-root-783954",
    "IAM",
    "IAM",
    "Root account activity should never originate outside your corporate IP allowlist. Rotate credentials and enable an SCP denying root usage.",
    ["Rotate the root access keys immediately", "Enable MFA on the root account if not already set", "Apply an SCP that denies root API actions", "Investigate the source IP with CloudTrail"],
  ],
  [
    "High",
    "IAM role created with wildcard permissions",
    "svc-billing-role",
    "IAM",
    "IAM",
    "Replace the wildcard policy with a least-privilege policy scoped to the specific actions this service needs.",
    ["Identify the actions actually used via Access Analyzer", "Draft a scoped policy replacing Action: *", "Attach and test the new policy in a staging role first", "Detach the wildcard policy"],
  ],
  [
    "High",
    "New security group rule opens 0.0.0.0/0 on port 3389",
    "vpc-web-sg",
    "Network",
    "EC2",
    "RDP should never be open to the entire internet. Restrict to a bastion host or VPN CIDR range.",
    ["Identify who needs RDP access and from where", "Replace 0.0.0.0/0 with the specific CIDR or bastion SG", "Enable Session Manager as a longer-term alternative", "Re-scan to confirm the rule is closed"],
  ],
  [
    "High",
    "Container image with 3 critical CVEs pushed",
    "ecr/skyshield-demo-app",
    "Container",
    "ECR",
    "Rebuild the image from an updated base image and re-scan before allowing deployment to proceed.",
    ["Check the Trivy report for the specific CVE IDs", "Update the base image tag in the Dockerfile", "Rebuild and re-scan the image", "Block deployment until the scan passes"],
  ],
  [
    "Medium",
    "Security group open on port 22",
    "vpc-web-sg",
    "Network",
    "EC2",
    "SSH access should be limited to a bastion host or restricted CIDR, not left open broadly.",
    ["Confirm which hosts require SSH access", "Restrict the rule to a bastion security group", "Consider migrating to Session Manager"],
  ],
  [
    "Medium",
    "Kubernetes pod running as root",
    "eks/checkout-service",
    "Container",
    "EKS",
    "Set a non-root securityContext on this deployment to reduce blast radius if the container is compromised.",
    ["Add runAsNonRoot: true to the pod spec", "Set a specific runAsUser in the securityContext", "Roll out the updated deployment", "Verify with kubectl describe pod"],
  ],
  [
    "Medium",
    "TLS 1.0 still enabled on ALB listener",
    "alb-public-prod",
    "Network",
    "ELB",
    "Update the ALB's SSL policy to a modern TLS 1.2+ policy to remove support for deprecated protocol versions.",
    ["Open the listener configuration on the ALB", "Change the security policy to ELBSecurityPolicy-TLS13-1-2-2021-06", "Verify no legacy clients depend on TLS 1.0"],
  ],
  [
    "Medium",
    "RDS instance not encrypted at rest",
    "passenger-db-primary",
    "Data",
    "RDS",
    "Enabling encryption at rest requires a snapshot-and-restore; schedule a maintenance window to migrate to an encrypted instance.",
    ["Take a final snapshot of the instance", "Copy the snapshot with encryption enabled", "Restore a new instance from the encrypted snapshot", "Cut over during a maintenance window"],
  ],
  [
    "Low",
    "Unused access key older than 90 days",
    "iam-user-ci-bot",
    "IAM",
    "IAM",
    "Rotate or deactivate access keys that haven't been used recently to reduce standing credential risk.",
    ["Confirm the key is truly unused via IAM last-used data", "Deactivate the key", "Monitor for breakage over one release cycle", "Delete the key if nothing breaks"],
  ],
  [
    "Low",
    "CloudTrail logging gap detected",
    "org-trail-primary",
    "Compliance",
    "CloudTrail",
    "Investigate the logging gap window and confirm no unauthorized changes occurred during that period.",
    ["Check CloudTrail trail status and delivery health", "Review S3 bucket permissions for the trail destination", "Cross-reference the gap window with CloudWatch"],
  ],
  [
    "Low",
    "EBS snapshot not encrypted",
    "snap-0a12ff88",
    "Data",
    "EC2",
    "Copy the snapshot with encryption enabled and update your AMI creation pipeline to encrypt by default.",
    ["Copy the snapshot enabling encryption", "Update the source AMI reference", "Enable account-level default EBS encryption"],
  ],
  [
    "Medium",
    "Lambda function has excessive execution role permissions",
    "weather-ingest-fn",
    "IAM",
    "Lambda",
    "Scope the execution role down to only the specific S3 prefix and DynamoDB table this function touches.",
    ["Review CloudTrail for actions actually performed", "Write a scoped policy matching only those actions", "Test in a non-prod alias before promoting"],
  ],
  [
    "High",
    "Terraform plan introduces unrestricted egress rule",
    "infra/networking",
    "Network",
    "VPC",
    "Block this plan from being applied until the egress rule is scoped to required destinations only.",
    ["Reject the pull request introducing the change", "Scope egress to specific CIDR ranges or prefix lists", "Re-run Checkov to confirm the finding clears"],
  ],
  [
    "Critical",
    "Secrets pattern matched in commit history",
    "github/skyshield-services",
    "Compliance",
    "GitHub",
    "Rotate the exposed credential immediately and scrub it from git history — assume it is compromised.",
    ["Rotate the exposed credential now", "Remove the secret from git history with BFG or git-filter-repo", "Force-push the cleaned history after team coordination", "Add a pre-commit secrets scanner going forward"],
  ],
  [
    "Low",
    "Compute instance missing required tags",
    "i-0a1b2c3d4e5f6789a",
    "Compute",
    "EC2",
    "Apply the standard tagging schema so this instance is included in cost allocation and ownership reporting.",
    ["Identify the correct owner and cost center", "Apply Environment, Owner, and CostCenter tags", "Add the instance to the tagging compliance dashboard"],
  ],
  [
    "Medium",
    "Auto-scaling group spans single availability zone",
    "checkin-api-asg",
    "Compute",
    "EC2",
    "Expand the ASG's subnet configuration to span at least two AZs to survive a zonal outage.",
    ["Identify a second subnet in a different AZ", "Add the subnet to the ASG's VPC zone identifier", "Force an instance refresh to rebalance"],
  ],
  [
    "High",
    "Anomalous API call volume from new region",
    "iam-user-data-pipeline",
    "IAM",
    "IAM",
    "Confirm whether this is expected traffic growth or a compromised credential being used from an unexpected location.",
    ["Cross-reference the source IP and region with known infrastructure", "Check for any recent credential exposure", "Temporarily restrict the identity's permissions if unconfirmed"],
  ],
];

const STATUSES: Finding["status"][] = ["Open", "Open", "In Progress", "Resolved"];
const ASSIGNEES = ["Unassigned", "Alex Rivera", "Priyanshi S.", "Daniel Okafor", "Priya Chandran"];

export const findings: Finding[] = FINDING_TEMPLATES.map(
  ([severity, title, resource, category, affectedService, recommendation, fixSteps], index) => {
    const discovered = index < 3 ? `${(index + 1) * 7}m ago` : `${(index % 14) + 1}d ago`;
    return {
      id: `find-${(3000 + index).toString()}`,
      severity,
      title,
      resource,
      category,
      status: STATUSES[(index * 5) % STATUSES.length],
      assignee: ASSIGNEES[(index * 3) % ASSIGNEES.length],
      discovered,
      affectedService,
      recommendation,
      fixSteps,
      timeline: [
        { label: "Finding detected by SkyShield scan", time: discovered },
        { label: "Triage assigned", time: index < 3 ? `${(index + 1) * 5}m ago` : `${(index % 14)}d ago` },
        ...(STATUSES[(index * 5) % STATUSES.length] === "Resolved"
          ? [{ label: "Remediated and verified", time: "1h ago" }]
          : []),
      ],
    };
  }
);
