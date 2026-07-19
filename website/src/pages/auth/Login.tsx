import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LuLoaderCircle } from "react-icons/lu";
import AuthLayout from "./AuthLayout";
import TextField from "../../components/ui/TextField";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? "/app";

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    // Demo-only auth: no backend exists, this simulates a network round trip.
    setTimeout(() => {
      login(email);
      navigate(redirectTo, { replace: true });
    }, 700);
  }

  function handleDemoAccess() {
    setLoading(true);
    // Demo org sign-in — no credentials required, brief simulated handshake.
    setTimeout(() => {
      login("");
      navigate("/app", { replace: true });
    }, 400);
  }

  return (
    <AuthLayout
      title="Access SkyShield Console"
      subtitle="Sign in to access your organization's AI-powered Aviation Cloud Security Platform."
      badge="Enterprise Edition"
      footer={
        <>
          Need Enterprise Access?{" "}
          <Link to="/signup" className="text-accent-2 hover:text-text transition-colors">
            Request Enterprise Access
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="Corporate Email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField label="Password" type="password" placeholder="••••••••" required />
        <Button type="submit" variant="primary" className="w-full justify-center" disabled={loading}>
          {loading ? <LuLoaderCircle className="animate-spin" size={16} aria-hidden="true" /> : "Sign In"}
        </Button>
      </form>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-text-muted">or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <button
        type="button"
        onClick={handleDemoAccess}
        disabled={loading}
        className="mt-6 w-full rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-text transition-all hover:border-accent/50 hover:bg-white/5 disabled:opacity-60"
      >
        Launch Demo Environment
      </button>
    </AuthLayout>
  );
}
