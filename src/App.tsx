import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { toast, Toaster } from "sonner";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Copyright from "./pages/Copyright";
import NotFound from "./pages/NotFound";
import { TouchPhysicsCanvas } from "./components/TouchPhysicsCanvas";
import { safeGetItem } from "./lib/safeStorage";

// Full-Stack Custom Glass Theme Dashboard Components
import DashboardLayout from "./pages/DashboardLayout";
import DashboardOverview from "./pages/DashboardOverview";
import DashboardPricing from "./pages/DashboardPricing";
import DashboardCourse from "./pages/DashboardCourse";
import DashboardKronAI from "./pages/DashboardKronAI";
import DashboardHistory from "./pages/DashboardHistory";
import DashboardVisionAI from "./pages/DashboardVisionAI";
import DashboardAdmin from "./pages/DashboardAdmin";

export default function App() {
  useEffect(() => {
    // Universal Referral Link Tracker
    const queryParams = new URLSearchParams(window.location.search);
    const refId = queryParams.get("ref") || queryParams.get("referrer");
    if (refId) {
      localStorage.setItem("kron_referrer_id", refId);
      setTimeout(() => {
        toast.success("Affiliate Partner Registered", {
          description: "Complete your account registration to participate in this exclusive Master Class offer.",
          duration: 6000
        });
      }, 800);
    }

    const savedFloat = safeGetItem("auratech_cinematic_float", "false") === "true";
    const savedIntensity = safeGetItem("auratech_float_intensity", "cinematic");
    const root = document.documentElement;
    if (savedFloat) {
      root.classList.add("cinematic-floating");
      root.setAttribute("data-float-intensity", savedIntensity);
    } else {
      root.classList.remove("cinematic-floating");
      root.removeAttribute("data-float-intensity");
    }
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <TouchPhysicsCanvas />
        <Routes>
          {/* Public Entrance Views */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/copyright" element={<Copyright />} />

          {/* Secure High-Density Creator Workspace Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="kron-ai" element={<DashboardKronAI />} />
            <Route path="vision" element={<DashboardVisionAI />} />
            <Route path="pricing" element={<DashboardPricing />} />
            <Route path="referrals" element={<DashboardCourse />} />
            <Route path="course" element={<DashboardCourse />} />
            <Route path="history" element={<DashboardHistory />} />
            <Route path="admin" element={<DashboardAdmin />} />
          </Route>

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
export { App };
