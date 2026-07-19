import { findings } from "./mock/findings";
import { complianceFrameworks } from "./complianceFrameworks";
import { complianceControls } from "./mock/complianceControls";
import { terraformRuns } from "./mock/terraformRuns";
import { k8sClusters, k8sWorkloads } from "./mock/kubernetes";
import { containerImages } from "./mock/containers";
import { awsResources } from "./mock/awsResources";
import { ec2Instances } from "./mock/ec2Instances";

interface Rule {
  keywords: string[];
  answer: () => string;
}

function todaysCriticalFindings(): string {
  const critical = findings.filter((f) => f.severity === "Critical");
  if (critical.length === 0) return "You have no critical findings open right now — nice work.";
  const top = critical[0];
  return `You have ${critical.length} critical finding${critical.length === 1 ? "" : "s"} open right now. The highest priority is "${top.title}" on ${top.resource}, detected ${top.discovered}. Recommendation: ${top.recommendation}`;
}

function complianceScoreChange(): string {
  const overall = Math.round(complianceFrameworks.reduce((s, f) => s + f.score, 0) / complianceFrameworks.length);
  const lowest = [...complianceFrameworks].sort((a, b) => a.score - b.score)[0];
  const inReview = complianceControls.filter((c) => c.status === "In Review").length;
  return `Your overall compliance score is ${overall}%. The lowest-scoring framework is ${lowest.name} at ${lowest.score}% — ${inReview} control${inReview === 1 ? "" : "s"} across all frameworks are currently "In Review," which is usually what drags a score down. Want the full control list?`;
}

function highestCpuInstances(): string {
  const running = ec2Instances.filter((i) => i.state === "Running").sort((a, b) => b.cpu - a.cpu).slice(0, 3);
  const list = running.map((i) => `${i.name} (${i.cpu}%)`).join(", ");
  return `Sorting running instances by CPU utilization: ${list}. Everything else in the fleet is below that. Want me to check if the top one needs a larger instance type?`;
}

function explainTerraformMisconfig(): string {
  const withFindings = terraformRuns.find((r) => r.checkovFindings > 0);
  if (!withFindings) return "No open Terraform/Checkov findings right now — every recent run scanned clean.";
  const detail = withFindings.checkovDetails[0];
  return `The most recent flagged run is ${withFindings.id} on ${withFindings.workspace}: ${detail}. That's ${withFindings.checkovFindings} total finding${withFindings.checkovFindings === 1 ? "" : "s"} in that run. Want the fix for this specific check?`;
}

function howToFix(): string {
  const critical = findings.filter((f) => f.severity === "Critical")[0] ?? findings[0];
  const steps = critical.fixSteps.map((step, i) => `${i + 1}. ${step}`).join(" ");
  return `For "${critical.title}": ${steps} Want the steps for a different finding — just name it.`;
}

function recommendImprovements(): string {
  const critical = findings.filter((f) => f.severity === "Critical" && f.status !== "Resolved").slice(0, 2);
  const items = critical.map((f) => `close "${f.title}" on ${f.resource}`);
  const driftedModule = terraformRuns.find((r) => r.checkovFindings > 0);
  if (driftedModule) items.push(`clear the Checkov finding on ${driftedModule.workspace}`);
  return `Three things would move the needle most: ${items.join("; ")}. Fixing those would meaningfully improve your risk score.`;
}

function todayContext(): string {
  const critical = findings.filter((f) => f.severity === "Critical");
  const open = findings.filter((f) => f.status === "Open");
  return `Today: ${critical.length} critical finding${critical.length === 1 ? "" : "s"} open, ${open.length} finding${open.length === 1 ? "" : "s"} total awaiting triage. ${
    critical[0] ? `Top priority: "${critical[0].title}" on ${critical[0].resource}.` : ""
  }`;
}

function kubernetesStatus(): string {
  const degraded = k8sClusters.filter((c) => c.status === "Degraded");
  const degradedWorkloads = k8sWorkloads.filter((w) => w.status !== "Running");
  if (degraded.length === 0 && degradedWorkloads.length === 0) return "All Kubernetes clusters and workloads are healthy right now.";
  const clusterPart = degraded
    .map((c) => `${c.name} has ${c.nodesTotal - c.nodesHealthy} node(s) unhealthy out of ${c.nodesTotal}`)
    .join("; ");
  const workloadPart = degradedWorkloads.length
    ? ` ${degradedWorkloads.length} workload(s) are not fully Running, including ${degradedWorkloads[0].name} in ${degradedWorkloads[0].namespace}.`
    : "";
  return `${clusterPart || "All clusters report healthy."}${workloadPart}`;
}

function containerStatus(): string {
  const totalVulns = containerImages.reduce((s, i) => s + i.critical + i.high + i.medium + i.low, 0);
  const criticalImages = containerImages.filter((i) => i.critical > 0);
  return `Across ${containerImages.length} scanned images there are ${totalVulns} open vulnerabilities. ${
    criticalImages.length > 0
      ? `${criticalImages.length} image(s) have critical CVEs — starting with ${criticalImages[0].image}:${criticalImages[0].tag}.`
      : "None of them are critical severity right now."
  }`;
}

function costSummary(): string {
  const total = awsResources.reduce((s, r) => s + r.monthlyCost, 0);
  const byType = new Map<string, number>();
  awsResources.forEach((r) => byType.set(r.type, (byType.get(r.type) ?? 0) + r.monthlyCost));
  const top = [...byType.entries()].sort((a, b) => b[1] - a[1])[0];
  return `Estimated monthly AWS spend across monitored resources is $${total.toLocaleString()}. ${top[0]} is the largest line item at $${top[1].toLocaleString()}/mo.`;
}

// Ordered most-specific to least-specific — the first keyword match wins.
const RULES: Rule[] = [
  { keywords: ["today"], answer: todayContext },
  { keywords: ["why did", "score drop", "dropped", "why is my compliance"], answer: complianceScoreChange },
  { keywords: ["highest cpu", "cpu usage", "which ec2", "top cpu"], answer: highestCpuInstances },
  { keywords: ["misconfiguration", "explain this terraform", "explain terraform"], answer: explainTerraformMisconfig },
  { keywords: ["how do i fix", "how to fix", "fix this"], answer: howToFix },
  { keywords: ["recommend", "improvement", "suggest"], answer: recommendImprovements },
  { keywords: ["critical", "urgent"], answer: todaysCriticalFindings },
  { keywords: ["compliance", "soc", "iso", "audit"], answer: complianceScoreChange },
  { keywords: ["terraform", "iac", "checkov"], answer: explainTerraformMisconfig },
  { keywords: ["kubernetes", "k8s", "cluster", "pod"], answer: kubernetesStatus },
  { keywords: ["container", "docker", "cve", "vulnerabilit"], answer: containerStatus },
  { keywords: ["cost", "spend", "billing"], answer: costSummary },
];

const FALLBACK =
  "I can help you investigate findings, compliance posture, infrastructure health, or pipeline activity. Try asking about a specific resource, severity level, or framework.";

export function getAssistantResponse(message: string): string {
  const lower = message.toLowerCase();
  const match = RULES.find((rule) => rule.keywords.some((keyword) => lower.includes(keyword)));
  return match ? match.answer() : FALLBACK;
}

export const suggestedPrompts = [
  "Show today's critical findings",
  "Why did my compliance score drop?",
  "Which EC2 instances have the highest CPU usage?",
  "Recommend security improvements",
];
