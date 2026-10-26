import { useNavigate, useLocation, useSearchParams } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  CalendarDays,
  ChevronRight,
  ClipboardList,
  FileText,
  LineChart,
  Package,
  ShoppingCart,
  SlidersHorizontal,
  UserRoundCheck,
  UsersRound,
  ChevronsUpDown,
} from "lucide-react"

export function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { setOpenMobile } = useSidebar()
  const isPharmacist =
    searchParams.get("role") === "pharmacist" ||
    window.localStorage.getItem("baylan-role") === "pharmacist"

  const handleNavigate = (path: string) => {
    setOpenMobile(false)
    // Wait for the bottom sheet's closing animation to completely finish (typically 300ms)
    // before triggering the navigation. This prevents layout shifts and stuttering.
    setTimeout(() => {
      navigate(path)
    }, 350)
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-col p-0">
        <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-4 transition-all duration-200 ease-linear group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-[6px] bg-transparent transition-all duration-200 ease-linear">
            <img
              src="/baylan-logo.svg"
              alt="Baylan Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex max-w-[250px] flex-col overflow-hidden transition-all duration-200 ease-linear group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0">
            <img
              src="/baylan-text.svg"
              alt="Baylan"
              className="baylan-wordmark h-15 w-auto whitespace-nowrap"
            />
          </div>
        </div>
        <div className="px-4 pt-2 pb-2 transition-all duration-200 ease-linear group-data-[collapsible=icon]:px-0">
          <div className="flex items-center gap-2 text-left transition-all duration-200 ease-linear group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-transparent ring-1 ring-border transition-all duration-200 ease-linear">
              {isPharmacist ? (
                <img
                  src="/mercury-drugs.jpeg"
                  aria-label="Mercury Drug"
                  alt="Mercury Drug"
                  className="h-full w-full object-contain p-0.5"
                />
              ) : null}
            </div>
            <div className="flex max-w-[250px] flex-1 flex-col overflow-hidden text-left whitespace-nowrap transition-all duration-200 ease-linear group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0">
              <span className="text-xs font-medium text-foreground">
                {isPharmacist ? "Mercury Drug" : "St. Gabriel General Hospital"}
              </span>
              <span className="text-[10px] font-normal text-muted-foreground">
                {isPharmacist ? "Pharmacy" : "Specialized Service"}
              </span>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="relative overflow-hidden group-data-[collapsible=icon]:mt-0 group-data-[collapsible=icon]:opacity-100">
            <span className="whitespace-nowrap transition-opacity duration-200 ease-linear group-data-[collapsible=icon]:opacity-0">
              Clinical Operations
            </span>
            <div className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-sidebar-border opacity-0 transition-opacity duration-200 ease-linear group-data-[collapsible=icon]:opacity-100" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isPharmacist && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={location.pathname === "/dashboard/point-of-sale"}
                      onClick={() => handleNavigate("/dashboard/point-of-sale")}
                    >
                      <ShoppingCart className="mr-2" />
                      <span>Point of Sale</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={location.pathname === "/dashboard/orders"}
                      onClick={() => handleNavigate("/dashboard/orders")}
                    >
                      <ClipboardList className="mr-2" />
                      <span>Orders</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname === "/dashboard/prescriptions"}
                  onClick={() => handleNavigate("/dashboard/prescriptions")}
                >
                  <FileText className="mr-2" />
                  <span>Prescriptions</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname === "/dashboard/analytics"}
                  onClick={() => handleNavigate("/dashboard/analytics")}
                >
                  <LineChart className="mr-2" />
                  <span>Analytics</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {!isPharmacist && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={location.pathname === "/dashboard/appointments"}
                    onClick={() => handleNavigate("/dashboard/appointments")}
                  >
                    <UserRoundCheck className="mr-2" />
                    <span>Appointments</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {isPharmacist && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={location.pathname === "/dashboard/inventory"}
                    onClick={() => handleNavigate("/dashboard/inventory")}
                  >
                    <Package className="mr-2" />
                    <span>Inventory</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {!isPharmacist && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={location.pathname === "/dashboard/calendar"}
                    onClick={() => handleNavigate("/dashboard/calendar")}
                  >
                    <CalendarDays className="mr-2" />
                    <span>Calendar</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="relative overflow-hidden group-data-[collapsible=icon]:mt-0 group-data-[collapsible=icon]:opacity-100">
            <span className="whitespace-nowrap transition-opacity duration-200 ease-linear group-data-[collapsible=icon]:opacity-0">
              Practice Management
            </span>
            <div className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-sidebar-border opacity-0 transition-opacity duration-200 ease-linear group-data-[collapsible=icon]:opacity-100" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <UsersRound className="mr-2" />
                      <span>Team</span>
                      <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          isActive={location.pathname === "/dashboard/team"}
                          onClick={() => handleNavigate("/dashboard/team")}
                        >
                          <span>Team Management</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname === "/dashboard/settings"}
                  onClick={() => handleNavigate("/dashboard/settings")}
                >
                  <SlidersHorizontal className="mr-2" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="transition-all duration-200 ease-linear group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:!p-0 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-transparent transition-all duration-200 ease-linear">
                    <img
                      src="https://github.com/shadcn.png"
                      alt="Joseph Angelo"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex max-w-[250px] flex-1 flex-col overflow-hidden text-left whitespace-nowrap transition-all duration-200 ease-linear group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0">
                    <span className="truncate text-xs font-medium">
                      Joseph Angelo Petalio
                    </span>
                    <span className="truncate text-[10px] font-normal text-muted-foreground">
                      japetailo@gmail.com
                    </span>
                  </div>
                  <div className="ml-auto max-w-[20px] overflow-hidden whitespace-nowrap transition-all duration-200 ease-linear group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0">
                    <ChevronsUpDown className="size-4 text-muted-foreground" />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-dropdown-menu-trigger-width]"
              >
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleNavigate("/")}
                  className="cursor-pointer"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
