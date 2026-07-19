import type { IconType } from "react-icons";
import {
  LuBrainCircuit,
  LuCloudCog,
  LuClipboardCheck,
  LuWorkflow,
  LuActivity,
  LuServerCog,
} from "react-icons/lu";

export interface HeroHighlight {
  icon: IconType;
  label: string;
}

export const heroHighlights: HeroHighlight[] = [
  { icon: LuBrainCircuit, label: "AI Threat Detection" },
  { icon: LuCloudCog, label: "AWS Infrastructure Monitoring" },
  { icon: LuClipboardCheck, label: "Compliance Automation" },
  { icon: LuWorkflow, label: "DevSecOps Security" },
  { icon: LuActivity, label: "Real-Time Risk Analysis" },
  { icon: LuServerCog, label: "Cloud Misconfiguration Detection" },
];
