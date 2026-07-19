export interface CveEntry {
  id: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  package: string;
  fixedIn: string;
}

export interface ContainerImage {
  id: string;
  image: string;
  tag: string;
  registry: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
  sizeMb: number;
  lastScanned: string;
  secretsDetected: number;
  cves: CveEntry[];
}

const IMAGES = [
  "skyshield-demo-app",
  "checkout-service",
  "boarding-pass-service",
  "gate-assignment-api",
  "crew-scheduling",
  "baggage-tracking",
  "maintenance-db-proxy",
  "weather-ingest",
  "analytics-pipeline",
  "ingress-controller",
  "log-forwarder",
  "metrics-agent",
  "session-cache",
  "docs-render-worker",
];

const CVE_PACKAGES = ["openssl", "libcurl", "glibc", "zlib", "busybox", "node", "python3-pip"];

export const containerImages: ContainerImage[] = IMAGES.map((image, index) => {
  const critical = index % 5 === 0 ? (index % 3) : 0;
  const high = (index * 3) % 6;
  const medium = (index * 5) % 10;
  const low = (index * 2) % 8;
  const total = critical + high + medium + low;

  const severityOrder: CveEntry["severity"][] = [
    ...Array(critical).fill("Critical"),
    ...Array(high).fill("High"),
    ...Array(medium).fill("Medium"),
    ...Array(low).fill("Low"),
  ];

  const cves: CveEntry[] = severityOrder.slice(0, Math.min(total, 6)).map((severity, i) => ({
    id: `CVE-2025-${(10000 + index * 37 + i * 13).toString().slice(0, 5)}`,
    severity,
    package: CVE_PACKAGES[(index + i) % CVE_PACKAGES.length],
    fixedIn: `${1 + ((index + i) % 4)}.${(index + i) % 9}.${i}`,
  }));

  return {
    id: `img-${index + 1}`,
    image,
    tag: index % 4 === 0 ? "latest" : `v1.${(index % 9) + 1}.${index % 5}`,
    registry: "ecr.skyshield.io",
    critical,
    high,
    medium,
    low,
    sizeMb: 90 + ((index * 47) % 400),
    lastScanned: `${(index % 24) + 1}h ago`,
    secretsDetected: index === 4 ? 1 : 0,
    cves,
  };
});
