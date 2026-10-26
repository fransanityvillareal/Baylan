import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Bell,
  Moon,
  Sun,
  Check,
} from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/components/theme-provider"
import { useLocation } from "react-router-dom"
import { Fragment } from "react"

export function AppHeader() {
  const { theme, setTheme } = useTheme()
  const location = useLocation()
  const breadcrumbs = (() => {
    const path = location.pathname

    if (path === "/dashboard/prescriptions") {
      return { section: "Clinical Operations", items: ["Prescriptions"] }
    }
    if (path === "/dashboard/analytics") {
      return { section: "Clinical Operations", items: ["Analytics"] }
    }
    if (path === "/dashboard/appointments") {
      return { section: "Clinical Operations", items: ["Appointments"] }
    }
    if (path === "/dashboard/inventory") {
      return { section: "Clinical Operations", items: ["Inventory"] }
    }
    if (path === "/dashboard/point-of-sale") {
      return { section: "Clinical Operations", items: ["Point of Sale"] }
    }
    if (path === "/dashboard/orders") {
      return { section: "Clinical Operations", items: ["Orders"] }
    }
    if (path === "/dashboard/calendar") {
      return { section: "Clinical Operations", items: ["Calendar"] }
    }
    if (path === "/dashboard/team") {
      return {
        section: "Practice Management",
        items: ["Team", "Team Management"],
      }
    }
    if (path === "/dashboard/settings") {
      return { section: "Practice Management", items: ["Settings"] }
    }
    if (path.startsWith("/dashboard/campaigns")) {
      return {
        section: "Core Operations",
        items: [
          "Campaigns",
          path.includes("review") ? "Campaign Review" : "Campaign List",
        ],
      }
    }
    return { section: "Clinical Operations", items: ["Prescriptions"] }
  })()

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-sidebar-border bg-white px-4 dark:bg-black">
      {/* --- DESKTOP LAYOUT --- */}
      <div className="hidden flex-1 items-center gap-2 md:flex">
        <SidebarTrigger className="-ml-1" />
        <div className="h-4 w-px bg-border" />
        <Breadcrumb>
          <BreadcrumbList className="text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/prescriptions">
                {breadcrumbs.section}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbs.items.map((item) => (
              <Fragment key={item}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-xs font-normal">
                    {item}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="hidden items-center gap-2 md:flex">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <Bell className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="flex w-[calc(100vw-2rem)] flex-col gap-4 rounded-xl border-border px-4 pt-4 pb-0 shadow-lg sm:w-[380px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                Notifications (3)
              </span>
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <label htmlFor="unreads-desktop" className="cursor-pointer">
                  Unreads (3)
                </label>
                <Switch
                  id="unreads-desktop"
                  className="origin-right scale-75"
                />
              </div>
            </div>
            <div className="flex flex-col items-stretch gap-2 xl:flex-row xl:items-center">
              <Input
                placeholder="Filter Notifications"
                className="h-8 bg-background text-xs dark:bg-[#111]"
              />
              <Button className="h-8 shrink-0 gap-1.5 bg-foreground px-3 text-xs text-background hover:bg-foreground/90 dark:bg-white dark:text-black">
                <Check className="h-3.5 w-3.5" />
                Mark all as read
              </Button>
            </div>
            <div className="-mx-4 mt-2 flex flex-col gap-2 border-t border-border px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="Joseph"
                    />
                    <AvatarFallback>JP</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium text-foreground">
                    Joseph Angelo Petalio
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  09:34 AM
                </span>
              </div>
              <p className="text-xs text-foreground">
                Requested your approval for the campaign Community Advocacy.
              </p>
            </div>
          </PopoverContent>
        </Popover>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="relative h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <div className="h-4 w-px bg-border" />
      </div>

      {/* --- MOBILE LAYOUT --- */}
      <div className="flex w-full items-center justify-between md:hidden">
        <Breadcrumb>
          <BreadcrumbList className="text-xs">
            <BreadcrumbItem>
              <BreadcrumbPage className="text-xs font-normal">
                {breadcrumbs.items[breadcrumbs.items.length - 1]}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Bell className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="center"
              collisionPadding={0}
              className="flex w-screen flex-col gap-4 rounded-xl border-border px-4 pt-4 pb-0 shadow-lg sm:w-[380px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  Notifications (3)
                </span>
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <label htmlFor="unreads-mobile" className="cursor-pointer">
                    Unreads (3)
                  </label>
                  <Switch
                    id="unreads-mobile"
                    className="origin-right scale-75"
                  />
                </div>
              </div>
              <div className="flex flex-col items-stretch gap-2 xl:flex-row xl:items-center">
                <Input
                  placeholder="Filter Notifications"
                  className="h-8 bg-background text-xs dark:bg-[#111]"
                />
                <Button className="h-8 shrink-0 gap-1.5 bg-foreground px-3 text-xs text-background hover:bg-foreground/90 dark:bg-white dark:text-black">
                  <Check className="h-3.5 w-3.5" />
                  Mark all as read
                </Button>
              </div>
              <div className="-mx-4 mt-2 flex flex-col gap-2 border-t border-border px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="Joseph"
                      />
                      <AvatarFallback>JP</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-foreground">
                      Joseph Angelo Petalio
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    09:34 AM
                  </span>
                </div>
                <p className="text-xs text-foreground">
                  Requested your approval for the campaign Community Advocacy.
                </p>
              </div>
            </PopoverContent>
          </Popover>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <SidebarTrigger className="-mr-1" />
        </div>
      </div>
    </header>
  )
}
