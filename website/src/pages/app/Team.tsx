import { useState } from "react";
import { LuUsers, LuUserPlus, LuMail, LuX } from "react-icons/lu";
import PageHeader from "../../components/app/PageHeader";
import StatTile from "../../components/app/StatTile";
import DataTable, { type DataTableColumn } from "../../components/app/DataTable";
import StatusBadge from "../../components/app/StatusBadge";
import Button from "../../components/ui/Button";
import TextField from "../../components/ui/TextField";
import { teamMembers as initialMembers, type TeamMember } from "../../data/mock/team";
import { useToast } from "../../context/ToastContext";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

const ROLES: TeamMember["role"][] = ["Owner", "Admin", "Security Engineer", "Viewer"];

const columns: DataTableColumn<TeamMember>[] = [
  {
    key: "name",
    header: "Member",
    sortValue: (r) => r.name,
    render: (r) => (
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-[11px] font-semibold text-white shrink-0">
          {initials(r.name)}
        </span>
        <div>
          <p className="text-text leading-tight">{r.name}</p>
          <p className="text-xs text-text-muted leading-tight">{r.email}</p>
        </div>
      </div>
    ),
  },
  { key: "role", header: "Role" },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "lastActive", header: "Last Active" },
];

export default function Team() {
  const { showToast } = useToast();
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamMember["role"]>("Viewer");

  const active = members.filter((m) => m.status === "Active").length;
  const invited = members.filter((m) => m.status === "Invited").length;

  function handleInvite() {
    if (!inviteName.trim() || !inviteEmail.trim()) {
      showToast({ tone: "warning", title: "Name and email are required" });
      return;
    }
    const newMember: TeamMember = {
      id: `user-${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      status: "Invited",
      lastActive: "Never",
    };
    setMembers((prev) => [newMember, ...prev]);
    showToast({ tone: "success", title: "Invitation sent", description: `${newMember.email} · ${newMember.role}` });
    setInviteName("");
    setInviteEmail("");
    setInviteRole("Viewer");
    setInviteOpen(false);
  }

  return (
    <div>
      <PageHeader
        title="Team Management"
        description="Everyone with access to your SkyShield workspace."
        actions={
          <Button variant="primary" className="text-sm px-5 py-2.5 gap-2" onClick={() => setInviteOpen((v) => !v)}>
            <LuUserPlus size={15} aria-hidden="true" />
            Invite Member
          </Button>
        }
      />

      {inviteOpen && (
        <div className="rounded-2xl glass p-5 sm:p-6 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text">Invite a team member</h3>
            <button type="button" onClick={() => setInviteOpen(false)} className="text-text-muted hover:text-text" aria-label="Close">
              <LuX size={16} aria-hidden="true" />
            </button>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <TextField label="Full name" value={inviteName} onChange={(e) => setInviteName(e.target.value)} placeholder="Jordan Lee" />
            <TextField label="Work email" type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="jordan@skyshield.io" />
            <div>
              <label className="block text-sm text-text-muted mb-1.5" htmlFor="invite-role">
                Role
              </label>
              <select
                id="invite-role"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as TeamMember["role"])}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-text outline-none focus:border-accent/50"
              >
                {ROLES.map((role) => (
                  <option key={role} value={role} className="bg-card">
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Button variant="primary" className="mt-4 text-sm px-5 py-2.5" onClick={handleInvite}>
            Send Invitation
          </Button>
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-4 mb-5">
        <StatTile icon={LuUsers} label="Total Members" value={String(members.length)} />
        <StatTile icon={LuUsers} label="Active" value={String(active)} trendPositive />
        <StatTile icon={LuMail} label="Pending Invites" value={String(invited)} trendPositive={invited === 0} trend={invited > 0 ? "awaiting response" : "none"} />
      </div>

      <DataTable
        columns={columns}
        data={members}
        rowKey={(row) => row.id}
        searchPlaceholder="Search team members..."
        searchFn={(row, q) => row.name.toLowerCase().includes(q) || row.email.toLowerCase().includes(q)}
        filters={[
          { key: "role", label: "Role", options: ROLES },
          { key: "status", label: "Status", options: ["Active", "Invited"] },
        ]}
        getFilterValue={(row, key) => (key === "role" ? row.role : key === "status" ? row.status : "")}
      />
    </div>
  );
}
