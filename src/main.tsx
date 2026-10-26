import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import "./index.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthForm } from "@/features/auth/components/AuthForm"
import { RoleSelection } from "@/features/auth/components/RoleSelection"
import { SignupOnboarding } from "@/features/auth/components/SignupOnboarding"
import { DashboardLayout } from "@/features/dashboard/components/DashboardLayout"
import { DashboardPage } from "@/features/dashboard/components/DashboardPage"
import { CampaignReviewPage } from "@/features/campaigns/components/CampaignReviewPage"
import { CampaignListPage } from "@/features/campaigns/components/CampaignListPage"
import { CalendarPage } from "@/features/calendar/components/CalendarPage"
import { MasterAvailabilityPage } from "@/features/master-availability/components/MasterAvailabilityPage"
import { TeamManagementPage } from "@/features/team/components/TeamManagementPage"
import { PrescriptionsPage } from "@/features/prescriptions/components/PrescriptionsPage"
import { AnalyticsPage } from "@/features/analytics/components/AnalyticsPage"
import { EmptyPage } from "@/features/dashboard/components/EmptyPage"
import { AppointmentsPage } from "@/features/appointments/components/AppointmentsPage"
import { InventoryPage } from "@/features/inventory/components/InventoryPage"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Route */}
          <Route path="/" element={<RoleSelection />} />
          <Route path="/signin" element={<AuthForm />} />
          <Route path="/signup" element={<AuthForm />} />
          <Route path="/signup/onboarding" element={<SignupOnboarding />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="prescriptions" element={<PrescriptionsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="campaigns/review" element={<CampaignReviewPage />} />
            {/* Placeholder routes for navigation */}
            <Route path="campaigns/list" element={<CampaignListPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route
              path="master-availability"
              element={<MasterAvailabilityPage />}
            />
            <Route path="team" element={<TeamManagementPage />} />
            <Route path="settings" element={<EmptyPage />} />
            <Route path="feedback" element={<EmptyPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
