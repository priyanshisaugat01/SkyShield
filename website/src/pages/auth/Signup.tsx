import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuLoaderCircle } from "react-icons/lu";
import AuthLayout from "./AuthLayout";
import TextField from "../../components/ui/TextField";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(email);
      navigate("/app", { replace: true });
    }, 700);
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start securing your cloud infrastructure in minutes."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-accent-2 hover:text-text transition-colors">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField label="Full name" type="text" placeholder="Jane Doe" required />
        <TextField label="Company" type="text" placeholder="Acme Aviation" required />
        <TextField
          label="Work email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField label="Password" type="password" placeholder="••••••••" required />
        <Button type="submit" variant="primary" className="w-full justify-center" disabled={loading}>
          {loading ? <LuLoaderCircle className="animate-spin" size={16} aria-hidden="true" /> : "Create account"}
        </Button>
      </form>
      <p className="mt-6 text-xs text-text-muted leading-relaxed">
        This is a self-contained product demo — no data leaves your browser and no real account is created.
      </p>
    </AuthLayout>
  );
}
