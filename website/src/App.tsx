import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./layouts/RequireAuth";
import AppShell from "./layouts/AppShell";
import LandingPage from "./pages/landing/LandingPage";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/app/Dashboard";
import Infrastructure from "./pages/app/Infrastructure";
import AwsResources from "./pages/app/AwsResources";
import Ec2Monitoring from "./pages/app/Ec2Monitoring";
import Kubernetes from "./pages/app/Kubernetes";
import Containers from "./pages/app/Containers";
import Terraform from "./pages/app/Terraform";
import Pipelines from "./pages/app/Pipelines";
import Compliance from "./pages/app/Compliance";
import SecurityFindings from "./pages/app/SecurityFindings";
import Reports from "./pages/app/Reports";
import Team from "./pages/app/Team";
import Settings from "./pages/app/Settings";
import AiAssistant from "./pages/app/AiAssistant";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/app"
            element={
              <RequireAuth>
                <AppShell />
              </RequireAuth>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="infrastructure" element={<Infrastructure />} />
            <Route path="aws-resources" element={<AwsResources />} />
            <Route path="ec2" element={<Ec2Monitoring />} />
            <Route path="kubernetes" element={<Kubernetes />} />
            <Route path="containers" element={<Containers />} />
            <Route path="terraform" element={<Terraform />} />
            <Route path="pipelines" element={<Pipelines />} />
            <Route path="compliance" element={<Compliance />} />
            <Route path="findings" element={<SecurityFindings />} />
            <Route path="reports" element={<Reports />} />
            <Route path="team" element={<Team />} />
            <Route path="settings" element={<Settings />} />
            <Route path="assistant" element={<AiAssistant />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
