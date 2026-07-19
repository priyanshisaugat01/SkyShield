export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Security Engineer" | "Viewer";
  status: "Active" | "Invited";
  lastActive: string;
}

const MEMBERS: [string, TeamMember["role"]][] = [
  ["Alex Rivera", "Owner"],
  ["Priyanshi Saugat", "Admin"],
  ["Daniel Okafor", "Security Engineer"],
  ["Priya Chandran", "Security Engineer"],
  ["Elena Marsh", "Admin"],
  ["Jordan Martinez", "Security Engineer"],
  ["Amy Chen", "Viewer"],
  ["Sam Whitfield", "Viewer"],
  ["Nina Petrova", "Security Engineer"],
];

export const teamMembers: TeamMember[] = MEMBERS.map(([name, role], index) => ({
  id: `user-${index + 1}`,
  name,
  email: `${name.toLowerCase().replace(/\s+/g, ".")}@skyshield.io`,
  role,
  status: index === 7 ? "Invited" : "Active",
  lastActive: index === 7 ? "Never" : index === 0 ? "Just now" : `${(index % 6) + 1}h ago`,
}));
