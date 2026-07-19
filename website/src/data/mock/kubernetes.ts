export interface K8sCluster {
  id: string;
  name: string;
  version: string;
  region: string;
  nodesHealthy: number;
  nodesTotal: number;
  status: "Healthy" | "Degraded";
}

export interface K8sWorkload {
  id: string;
  name: string;
  namespace: string;
  kind: "Deployment" | "StatefulSet" | "DaemonSet";
  replicas: string;
  status: "Running" | "Degraded" | "Pending";
  restarts: number;
  image: string;
  cpuRequest: string;
  memoryRequest: string;
  recentEvents: string[];
}

export const k8sClusters: K8sCluster[] = [
  { id: "cl-1", name: "prod-use1", version: "1.29", region: "us-east-1", nodesHealthy: 18, nodesTotal: 20, status: "Degraded" },
  { id: "cl-2", name: "prod-euw1", version: "1.29", region: "eu-west-1", nodesHealthy: 12, nodesTotal: 12, status: "Healthy" },
  { id: "cl-3", name: "staging-use1", version: "1.28", region: "us-east-1", nodesHealthy: 6, nodesTotal: 6, status: "Healthy" },
];

const WORKLOAD_NAMES: [string, string, K8sWorkload["kind"]][] = [
  ["checkout-service", "prod", "Deployment"],
  ["boarding-pass-service", "prod", "Deployment"],
  ["gate-assignment-api", "prod", "Deployment"],
  ["session-cache", "prod", "StatefulSet"],
  ["log-forwarder", "kube-system", "DaemonSet"],
  ["crew-scheduling", "prod", "Deployment"],
  ["baggage-tracking", "prod", "Deployment"],
  ["maintenance-db-proxy", "prod", "StatefulSet"],
  ["metrics-agent", "monitoring", "DaemonSet"],
  ["weather-ingest", "prod", "Deployment"],
  ["analytics-pipeline", "data", "StatefulSet"],
  ["ingress-controller", "kube-system", "Deployment"],
];

const STATUSES: K8sWorkload["status"][] = ["Running", "Running", "Running", "Running", "Degraded", "Pending"];

export const k8sWorkloads: K8sWorkload[] = WORKLOAD_NAMES.map(([name, namespace, kind], index) => {
  const restarts = (index * 7) % 12;
  return {
    id: `wl-${index + 1}`,
    name,
    namespace,
    kind,
    replicas: kind === "DaemonSet" ? `${6 + (index % 3)}/${6 + (index % 3)}` : `${2 + (index % 4)}/${2 + (index % 4)}`,
    status: STATUSES[(index * 3) % STATUSES.length],
    restarts,
    image: `ecr.skyshield.io/${name}:v1.${(index % 9) + 1}.${index % 5}`,
    cpuRequest: `${100 + (index % 5) * 50}m`,
    memoryRequest: `${128 + (index % 4) * 128}Mi`,
    recentEvents: [
      restarts > 5 ? `Restarted ${restarts} times — investigate liveness probe` : "Stable — no restarts in 24h",
      `Last rolled out ${(index % 10) + 1}d ago`,
    ],
  };
});

export interface K8sNamespace {
  name: string;
  pods: number;
  status: "Healthy" | "Degraded";
}

export const k8sNamespaces: K8sNamespace[] = [
  { name: "prod", pods: 34, status: "Healthy" },
  { name: "kube-system", pods: 12, status: "Healthy" },
  { name: "monitoring", pods: 6, status: "Healthy" },
  { name: "data", pods: 8, status: "Degraded" },
  { name: "staging", pods: 14, status: "Healthy" },
];

export const k8sResourceCounts = {
  deployments: 18,
  replicaSets: 22,
  services: 16,
  ingress: 5,
  pods: 74,
};

export interface K8sClusterEvent {
  message: string;
  time: string;
  severity: "info" | "warning" | "critical";
}

export const k8sClusterEvents: K8sClusterEvent[] = [
  { message: "Node ip-10-0-11-42 reporting NotReady", time: "6m ago", severity: "critical" },
  { message: "HorizontalPodAutoscaler scaled checkout-service to 4 replicas", time: "22m ago", severity: "info" },
  { message: "gate-assignment-api pod OOMKilled and restarted", time: "41m ago", severity: "warning" },
  { message: "Cluster autoscaler added 1 node to prod-use1", time: "1h ago", severity: "info" },
  { message: "PodDisruptionBudget blocked eviction for session-cache", time: "3h ago", severity: "warning" },
  { message: "Rolling update completed for crew-scheduling", time: "5h ago", severity: "info" },
];
