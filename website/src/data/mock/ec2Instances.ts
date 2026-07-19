export interface Ec2Instance {
  id: string;
  name: string;
  instanceType: string;
  state: "Running" | "Stopped" | "Pending";
  az: string;
  cpu: number;
  memory: number;
  privateIp: string;
  launched: string;
  ami: string;
  keyPair: string;
  securityGroups: string[];
  recentEvents: string[];
  tags: Record<string, string>;
}

const NAMES = [
  "prod-checkin-api-01",
  "prod-checkin-api-02",
  "flight-ops-worker-01",
  "flight-ops-worker-02",
  "bastion-host-eu",
  "baggage-tracking-01",
  "gate-assignment-01",
  "gate-assignment-02",
  "analytics-etl-worker",
  "crew-portal-web-01",
  "crew-portal-web-02",
  "maintenance-scheduler",
  "weather-ingest-worker",
  "docs-render-worker",
  "staging-checkin-api",
];

const TYPES = ["t3.large", "t3.xlarge", "m5.large", "m5.xlarge", "c5.large", "r5.large"];
const AZS = ["us-east-1a", "us-east-1b", "us-west-2a", "eu-west-1a"];
const STATES: Ec2Instance["state"][] = ["Running", "Running", "Running", "Running", "Stopped", "Pending"];
const SG_POOL = ["vpc-web-sg", "vpc-internal-prod", "bastion-sg", "db-access-sg"];

export const ec2Instances: Ec2Instance[] = NAMES.map((name, index) => ({
  id: `i-0${(index + 1).toString().padStart(8, "0")}`,
  name,
  instanceType: TYPES[index % TYPES.length],
  state: STATES[(index * 5) % STATES.length],
  az: AZS[index % AZS.length],
  cpu: 15 + ((index * 47) % 70),
  memory: 20 + ((index * 31) % 65),
  privateIp: `10.0.${(index % 4) + 1}.${20 + index}`,
  launched: `${(index % 60) + 1}d ago`,
  ami: `ami-0${(7000000000000000 + index * 91123).toString(16).slice(0, 13)}`,
  keyPair: "skyshield-key",
  securityGroups: [SG_POOL[index % SG_POOL.length], SG_POOL[(index + 1) % SG_POOL.length]],
  recentEvents: [
    index % 6 === 4 ? "Instance stopped by autoscaling policy" : "Status checks passed — 2/2",
    `Last patched ${(index % 20) + 1}d ago`,
  ],
  tags: { env: index < 12 ? "prod" : "staging", owner: "platform-team" },
}));
