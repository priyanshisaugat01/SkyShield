export interface PipelineStageResult {
  name: string;
  status: "Passed" | "Failed" | "Skipped" | "Running";
  durationSec: number;
}

export interface PipelineRun {
  id: string;
  repo: string;
  branch: string;
  stage: "Build" | "Security Scan" | "Deploy" | "Monitor";
  status: "Running" | "Passed" | "Failed" | "Pending";
  durationSec: number;
  commitSha: string;
  author: string;
  timestamp: string;
  stages: PipelineStageResult[];
}

const REPOS = [
  "skyshield-services",
  "skyshield-web",
  "checkout-service",
  "boarding-pass-service",
  "gate-assignment-api",
  "infra-terraform",
];

const STAGES: PipelineRun["stage"][] = ["Build", "Security Scan", "Deploy", "Monitor"];
const STATUSES: PipelineRun["status"][] = ["Passed", "Passed", "Passed", "Running", "Failed", "Pending"];
const AUTHORS = ["priyanshi.s", "ci-bot", "j.martinez", "a.chen", "d.okafor"];
const PIPELINE_STAGE_NAMES = ["GitHub", "Terraform", "Docker", "Security Scan", "Deploy", "Monitor"];

export const pipelineRuns: PipelineRun[] = Array.from({ length: 18 }, (_, index) => {
  const status = STATUSES[(index * 5) % STATUSES.length];
  const failAt = status === "Failed" ? 2 + (index % 3) : -1;
  const runningAt = status === "Running" ? 2 + (index % 3) : -1;

  const stages: PipelineStageResult[] = PIPELINE_STAGE_NAMES.map((name, stageIndex) => {
    let stageStatus: PipelineStageResult["status"] = "Passed";
    if (failAt >= 0 && stageIndex > failAt) stageStatus = "Skipped";
    else if (failAt >= 0 && stageIndex === failAt) stageStatus = "Failed";
    else if (runningAt >= 0 && stageIndex > runningAt) stageStatus = "Skipped";
    else if (runningAt >= 0 && stageIndex === runningAt) stageStatus = "Running";
    else if (status === "Pending") stageStatus = stageIndex === 0 ? "Running" : "Skipped";
    return { name, status: stageStatus, durationSec: 8 + ((index + stageIndex) * 11) % 60 };
  });

  return {
    id: `pl-${(2000 + index).toString()}`,
    repo: REPOS[index % REPOS.length],
    branch: index % 3 === 0 ? "main" : `feature/PR-${400 + index}`,
    stage: STAGES[index % STAGES.length],
    status,
    durationSec: 40 + ((index * 37) % 300),
    commitSha: (index * 7919).toString(16).slice(0, 7),
    author: AUTHORS[index % AUTHORS.length],
    timestamp: `${(index % 20) + 1}h ago`,
    stages,
  };
});
