import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { AppHeader } from "./AppHeader"

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-white dark:bg-black flex flex-col h-screen overflow-hidden">
        <AppHeader />
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Outlet renders the nested dashboard routes */}
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
