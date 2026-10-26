import { StrictMode } from "react"
import type { ReactNode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom"

import "./index.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthForm } from "@/features/auth/components/AuthForm"
import { RoleSelection } from "@/features/auth/components/RoleSelection"
import { SignupOnboarding } from "@/features/auth/components/SignupOnboarding"
import { DashboardLayout } from "@/features/dashboard/components/DashboardLayout"
import { CalendarPage } from "@/features/calendar/components/CalendarPage"
import { TeamManagementPage } from "@/features/team/components/TeamManagementPage"
import { PrescriptionsPage } from "@/features/prescriptions/components/PrescriptionsPage"
import { AnalyticsPage } from "@/features/analytics/components/AnalyticsPage"
import { EmptyPage } from "@/features/dashboard/components/EmptyPage"
import { AppointmentsPage } from "@/features/appointments/components/AppointmentsPage"
import { InventoryPage } from "@/features/inventory/components/InventoryPage"
import { MportPage } from "@/features/mport/components/MportPage"
import { PointOfSalePage } from "@/features/point-of-sale/components/PointOfSalePage"
import { OrdersPage } from "@/features/orders/components/OrdersPage"

function DoctorOnlyPage({ children }: { children: ReactNode }) {
  const isPharmacist = window.localStorage.getItem("baylan-role") === "pharmacist"
  return isPharmacist ? <Navigate to="/dashboard/prescriptions" replace /> : children
}

function PharmacistOnlyPage({ children }: { children: ReactNode }) {
  const isPharmacist = window.localStorage.getItem("baylan-role") === "pharmacist"
  return isPharmacist ? children : <Navigate to="/dashboard/prescriptions" replace />
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light">
      <BrowserRouter>
        <Routes>
          {/* Auth Route */}
          <Route path="/" element={<RoleSelection />} />
          <Route path="/signin" element={<AuthForm />} />
          <Route path="/signup" element={<AuthForm />} />
          <Route path="/signup/onboarding" element={<SignupOnboarding />} />
          <Route path="/mport" element={<MportPage />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="prescriptions" replace />} />
            <Route path="prescriptions" element={<PrescriptionsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route
              path="calendar"
              element={<DoctorOnlyPage><CalendarPage /></DoctorOnlyPage>}
            />
            <Route
              path="appointments"
              element={<DoctorOnlyPage><AppointmentsPage /></DoctorOnlyPage>}
            />
            <Route path="inventory" element={<PharmacistOnlyPage><InventoryPage /></PharmacistOnlyPage>} />
            <Route path="point-of-sale" element={<PharmacistOnlyPage><PointOfSalePage /></PharmacistOnlyPage>} />
            <Route path="orders" element={<PharmacistOnlyPage><OrdersPage /></PharmacistOnlyPage>} />
            <Route path="team" element={<TeamManagementPage />} />
            <Route path="settings" element={<EmptyPage />} />
            <Route path="feedback" element={<EmptyPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
