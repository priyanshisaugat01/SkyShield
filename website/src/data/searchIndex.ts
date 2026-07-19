import type { IconType } from "react-icons";
import { LuShieldAlert, LuCloud, LuServer, LuFileCode, LuContainer, LuServerCog, LuWorkflow, LuUsers } from "react-icons/lu";
import { findings } from "./mock/findings";
import { awsResources } from "./mock/awsResources";
import { ec2Instances } from "./mock/ec2Instances";
import { terraformRuns } from "./mock/terraformRuns";
import { containerImages } from "./mock/containers";
import { k8sWorkloads } from "./mock/kubernetes";
import { pipelineRuns } from "./mock/pipelines";
import { teamMembers } from "./mock/team";

export interface SearchResult {
  id: string;
  label: string;
  sublabel: string;
  category: string;
  icon: IconType;
  path: string;
}

function buildIndex(): SearchResult[] {
  const results: SearchResult[] = [];

  findings.forEach((f) =>
    results.push({ id: f.id, label: f.title, sublabel: `${f.resource} · ${f.severity}`, category: "Security Findings", icon: LuShieldAlert, path: "/app/findings" })
  );

  awsResources.forEach((r) =>
    results.push({ id: r.id, label: r.name, sublabel: `${r.type} · ${r.region}`, category: "AWS Resources", icon: LuCloud, path: "/app/aws-resources" })
  );

  ec2Instances.forEach((i) =>
    results.push({ id: i.id, label: i.name, sublabel: `${i.id} · ${i.instanceType}`, category: "EC2 Monitoring", icon: LuServer, path: "/app/ec2" })
  );

  terraformRuns.forEach((r) =>
    results.push({ id: r.id, label: r.id, sublabel: `${r.workspace} · ${r.status}`, category: "Terraform", icon: LuFileCode, path: "/app/terraform" })
  );

  containerImages.forEach((c) =>
    results.push({ id: c.id, label: c.image, sublabel: `${c.tag} · ${c.registry}`, category: "Containers", icon: LuContainer, path: "/app/containers" })
  );

  k8sWorkloads.forEach((w) =>
    results.push({ id: w.id, label: w.name, sublabel: `${w.namespace} · ${w.kind}`, category: "Kubernetes", icon: LuServerCog, path: "/app/kubernetes" })
  );

  pipelineRuns.forEach((p) =>
    results.push({ id: p.id, label: `${p.repo} — ${p.id}`, sublabel: `${p.branch} · ${p.stage}`, category: "DevSecOps Pipelines", icon: LuWorkflow, path: "/app/pipelines" })
  );

  teamMembers.forEach((m) =>
    results.push({ id: m.id, label: m.name, sublabel: `${m.role} · ${m.email}`, category: "Team Management", icon: LuUsers, path: "/app/team" })
  );

  return results;
}

export const searchIndex: SearchResult[] = buildIndex();

export function search(query: string, limit = 8): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return searchIndex
    .filter((item) => item.label.toLowerCase().includes(q) || item.sublabel.toLowerCase().includes(q) || item.category.toLowerCase().includes(q))
    .slice(0, limit);
}
