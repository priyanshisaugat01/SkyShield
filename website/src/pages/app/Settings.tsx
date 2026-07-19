import { useState } from "react";
import { LuKey, LuCopy, LuRefreshCw, LuGithub, LuSlack, LuCloud, LuTrash2 } from "react-icons/lu";
import PageHeader from "../../components/app/PageHeader";
import GlassCard from "../../components/ui/GlassCard";
import TextField from "../../components/ui/TextField";
import Toggle from "../../components/ui/Toggle";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

function generateApiKey() {
  const chars = "abcdef0123456789";
  let key = "sk_live_51skyshield_";
  for (let i = 0; i < 24; i++) key += chars[Math.floor(Math.random() * chars.length)];
  return key;
}

const INITIAL_INTEGRATIONS = [
  { id: "aws", icon: LuCloud, name: "AWS Organizations", connected: true, detail: "4 accounts" },
  { id: "github", icon: LuGithub, name: "GitHub", connected: true, detail: "6 repositories" },
  { id: "slack", icon: LuSlack, name: "Slack", connected: false, detail: "" },
];

export default function Settings() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [fullName, setFullName] = useState(user?.name ?? "Demo User");
  const [email, setEmail] = useState(user?.email ?? "demo@skyshield.io");
  const [savingProfile, setSavingProfile] = useState(false);
  const [notifications, setNotifications] = useState({
    criticalFindings: true,
    weeklyDigest: true,
    pipelineFailures: true,
    productUpdates: false,
  });
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [apiKey, setApiKey] = useState(() => generateApiKey());
  const [regenerating, setRegenerating] = useState(false);
  const [integrations, setIntegrations] = useState(INITIAL_INTEGRATIONS);
  const [deleteArmed, setDeleteArmed] = useState(false);

  const maskedKey = apiKeyVisible ? apiKey : `${apiKey.slice(0, 12)}${"•".repeat(20)}`;

  function handleSaveProfile() {
    setSavingProfile(true);
    setTimeout(() => {
      setSavingProfile(false);
      showToast({ tone: "success", title: "Profile updated", description: `${fullName} · ${email}` });
    }, 900);
  }

  function handleCopyKey() {
    navigator.clipboard?.writeText(apiKey).catch(() => {});
    showToast({ tone: "success", title: "API key copied to clipboard" });
  }

  function handleRegenerateKey() {
    if (regenerating) return;
    setRegenerating(true);
    setTimeout(() => {
      setApiKey(generateApiKey());
      setApiKeyVisible(true);
      setRegenerating(false);
      showToast({ tone: "warning", title: "API key regenerated", description: "The previous key is now invalid." });
    }, 800);
  }

  function toggleIntegration(id: string) {
    setIntegrations((prev) =>
      prev.map((integration) => {
        if (integration.id !== id) return integration;
        const nextConnected = !integration.connected;
        showToast({
          tone: nextConnected ? "success" : "info",
          title: nextConnected ? `${integration.name} connected` : `${integration.name} disconnected`,
        });
        return { ...integration, connected: nextConnected, detail: nextConnected ? integration.detail || "Connected" : "" };
      })
    );
  }

  function handleDeleteWorkspace() {
    if (!deleteArmed) {
      setDeleteArmed(true);
      showToast({ tone: "warning", title: "Click again to confirm", description: "This will permanently delete your workspace." });
      setTimeout(() => setDeleteArmed(false), 4000);
      return;
    }
    showToast({ tone: "danger", title: "Workspace deletion cancelled", description: "This is a demo environment — destructive actions are disabled." });
    setDeleteArmed(false);
  }

  return (
    <div>
      <PageHeader title="Settings" description="Manage your profile, workspace, and integrations." />

      <div className="grid lg:grid-cols-2 gap-5">
        <GlassCard className="p-6" hover={false}>
          <h2 className="text-sm font-semibold text-text mb-5">Profile</h2>
          <div className="space-y-4">
            <TextField label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="Role" defaultValue={user?.role ?? "Security Engineer"} disabled />
          </div>
          <Button variant="primary" className="mt-5 text-sm px-5 py-2.5 gap-2" onClick={handleSaveProfile} disabled={savingProfile}>
            {savingProfile ? "Saving..." : "Save changes"}
          </Button>
        </GlassCard>

        <GlassCard className="p-6" hover={false}>
          <h2 className="text-sm font-semibold text-text mb-5">Notifications</h2>
          <div className="space-y-4">
            {[
              { key: "criticalFindings" as const, label: "Critical findings", description: "Notify immediately when a critical finding is detected" },
              { key: "pipelineFailures" as const, label: "Pipeline failures", description: "Notify when a DevSecOps pipeline run fails" },
              { key: "weeklyDigest" as const, label: "Weekly digest", description: "A summary of posture changes every Monday" },
              { key: "productUpdates" as const, label: "Product updates", description: "New features and platform changes" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-text">{item.label}</p>
                  <p className="text-xs text-text-muted mt-0.5">{item.description}</p>
                </div>
                <Toggle
                  checked={notifications[item.key]}
                  onChange={(checked) => {
                    setNotifications((prev) => ({ ...prev, [item.key]: checked }));
                    showToast({ tone: "info", title: `${item.label} ${checked ? "enabled" : "disabled"}` });
                  }}
                  label={item.label}
                />
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6" hover={false}>
          <h2 className="text-sm font-semibold text-text mb-5">API Key</h2>
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5">
            <LuKey size={14} className="text-text-muted shrink-0" aria-hidden="true" />
            <code className="flex-1 text-xs text-text-muted truncate">{maskedKey}</code>
            <button
              type="button"
              onClick={() => setApiKeyVisible((v) => !v)}
              className="text-xs text-accent-2 hover:text-text transition-colors shrink-0"
            >
              {apiKeyVisible ? "Hide" : "Reveal"}
            </button>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={handleCopyKey}
              className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors"
            >
              <LuCopy size={13} aria-hidden="true" />
              Copy
            </button>
            <button
              type="button"
              onClick={handleRegenerateKey}
              disabled={regenerating}
              className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors disabled:opacity-50"
            >
              <LuRefreshCw size={13} className={regenerating ? "animate-spin" : ""} aria-hidden="true" />
              {regenerating ? "Regenerating..." : "Regenerate"}
            </button>
          </div>
        </GlassCard>

        <GlassCard className="p-6" hover={false}>
          <h2 className="text-sm font-semibold text-text mb-5">Integrations</h2>
          <div className="space-y-3">
            {integrations.map((integration) => (
              <div key={integration.name} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <integration.icon size={16} className="text-accent-2" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text">{integration.name}</p>
                  <p className="text-xs text-text-muted">{integration.connected ? `Connected · ${integration.detail}` : "Not connected"}</p>
                </div>
                <Button variant="secondary" className="text-xs px-4 py-1.5 shrink-0" onClick={() => toggleIntegration(integration.id)}>
                  {integration.connected ? "Disconnect" : "Connect"}
                </Button>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-6 mt-5 border-danger/20" hover={false}>
        <h2 className="text-sm font-semibold text-danger mb-2">Danger Zone</h2>
        <p className="text-xs text-text-muted mb-4">
          Deleting your workspace removes all connected accounts, findings, and history. This cannot be undone.
        </p>
        <button
          type="button"
          onClick={handleDeleteWorkspace}
          className={`flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium transition-colors ${
            deleteArmed ? "border-danger bg-danger/15 text-danger" : "border-danger/30 text-danger hover:bg-danger/10"
          }`}
        >
          <LuTrash2 size={14} aria-hidden="true" />
          {deleteArmed ? "Click to confirm deletion" : "Delete Workspace"}
        </button>
      </GlassCard>
    </div>
  );
}
