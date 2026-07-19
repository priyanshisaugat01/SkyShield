const DAYS = ["Jul 5", "Jul 6", "Jul 7", "Jul 8", "Jul 9", "Jul 10", "Jul 11", "Jul 12", "Jul 13", "Jul 14", "Jul 15", "Jul 16", "Jul 17", "Jul 18"];

export const riskTrend = DAYS.map((day, i) => ({
  day,
  risk: [6.1, 5.8, 6.4, 5.9, 5.2, 4.8, 4.6, 4.9, 4.3, 3.9, 3.6, 3.4, 3.2, 3.1][i],
}));

export const findingsTrend = DAYS.map((day, i) => ({
  day,
  findings: [48, 44, 51, 46, 39, 41, 35, 33, 30, 28, 26, 24, 23, 22][i],
}));

export const complianceTrend = DAYS.map((day, i) => ({
  day,
  score: [88, 89, 88, 90, 91, 91, 92, 92, 93, 93, 94, 94, 94, 94][i],
}));

export const costTrend = DAYS.map((day, i) => ({
  day,
  cost: [4120, 4180, 4090, 4260, 4310, 4295, 4380, 4420, 4390, 4460, 4510, 4480, 4550, 4590][i],
}));

export const findingsBySeverity = [
  { label: "Critical", value: 3, color: "#f87171" },
  { label: "High", value: 5, color: "#fb923c" },
  { label: "Medium", value: 6, color: "#facc15" },
  { label: "Low", value: 4, color: "#22d3ee" },
];
