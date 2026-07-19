import type { IconType } from "react-icons";
import { LuGithub, LuFileCode, LuContainer, LuScan, LuRocket, LuEye } from "react-icons/lu";

export interface DevSecOpsStep {
  icon: IconType;
  title: string;
}

export const devSecOpsSteps: DevSecOpsStep[] = [
  { icon: LuGithub, title: "GitHub" },
  { icon: LuFileCode, title: "Terraform" },
  { icon: LuContainer, title: "Docker" },
  { icon: LuScan, title: "Security Scan" },
  { icon: LuRocket, title: "Deploy" },
  { icon: LuEye, title: "Monitor" },
];
