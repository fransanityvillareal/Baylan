import { useState } from "react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import {
  CalendarRange,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock3,
  Download,
  Filter,
  MapPin,
  MoreVertical,
  PlusCircle,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DataExportModal } from "@/features/dashboard/components/DataExportModal"

type Appointment = {
  id: string
  patient: string
  practitioner: string
  type: string
  date: string
  time: string
  location: string
  status: "Confirmed" | "Pending" | "Completed" | "Cancelled"
}

const appointments: Appointment[] = [
  {
    id: "APT-2026-0148",
    patient: "Angelo Melicio Agawa",
    practitioner: "Dr. Marc Lester E. Sulit",
    type: "Follow-up Consultation",
    date: "Jun 08, 2026",
    time: "10:30 AM",
    location: "Outpatient Clinic 2",
    status: "Confirmed",
  },
  {
    id: "APT-2026-0147",
    patient: "Daniel Cruz",
    practitioner: "Dr. Maria Santos",
    type: "Medication Review",
    date: "Jun 08, 2026",
    time: "01:00 PM",
    location: "Teleconsultation",
    status: "Pending",
  },
  {
    id: "APT-2026-0146",
    patient: "Beatrice Flores",
    practitioner: "Dr. Marc Lester E. Sulit",
    type: "Initial Consultation",
    date: "Jun 09, 2026",
    time: "09:00 AM",
    location: "Outpatient Clinic 1",
    status: "Confirmed",
  },
]

const filterOptions = {
  Status: ["Confirmed", "Pending", "Completed", "Cancelled"],
  Type: ["Initial Consultation", "Follow-up Consultation", "Medication Review"],
}

export function AppointmentsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {}
  )

  const toggleFilter = (filterName: string, option: string) => {
    setActiveFilters((current) => {
      const selected = current[filterName] ?? []
      return {
        ...current,
        [filterName]: selected.includes(option)
          ? selected.filter((item) => item !== option)
          : [...selected, option],
      }
    })
  }

  return (
    <div className="relative flex h-full w-full items-start overflow-hidden bg-background dark:bg-black">
      <div className="flex h-full w-full min-w-0 flex-col overflow-y-auto text-foreground">
        <div className="sticky top-0 z-10 flex flex-col gap-4 bg-background p-4 pr-4 pb-4 pl-3 dark:bg-black">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex w-full items-center justify-between gap-4 md:w-auto md:justify-start">
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-sidebar-border bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 border-sidebar-border bg-transparent px-3 text-xs font-medium"
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-sidebar-border bg-transparent"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <h2 className="truncate text-lg font-semibold md:text-xl">
                June 2026
              </h2>
            </div>
            <Button className="h-8 w-full gap-2 px-2 text-xs font-medium md:w-auto">
              <PlusCircle className="h-3.5 w-3.5" />
              Create Appointment
            </Button>
          </div>

          <div className="-mb-2 flex w-full shrink-0 overflow-x-auto pb-2">
            <Tabs defaultValue="today" className="w-full md:w-max">
              <TabsList className="h-9 w-full justify-start gap-1 rounded-md border-none bg-muted p-1 md:w-max dark:bg-[#1e1e1e]">
                {[
                  ["today", "Today"],
                  ["all", "All Appointments"],
                  ["upcoming", "Upcoming"],
                  ["completed", "Completed"],
                ].map(([value, label]) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="h-full rounded-sm border border-transparent px-2 py-1 text-xs font-medium text-muted-foreground transition-all data-[state=active]:!border-border data-[state=active]:!bg-background data-[state=active]:text-foreground dark:text-white/70 dark:data-[state=active]:!border-[#333] dark:data-[state=active]:!bg-black dark:data-[state=active]:text-white"
                  >
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="flex flex-col items-start justify-between gap-4 xl:flex-row xl:items-center">
            <div className="flex w-full flex-wrap items-center gap-2 xl:w-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="hidden h-8 shrink-0 gap-2 border-dashed border-sidebar-border !bg-background px-2 text-xs font-medium text-foreground hover:bg-accent md:flex dark:!bg-black dark:text-white dark:hover:bg-white/5"
                  >
                    <CalendarRange className="h-3.5 w-3.5" />
                    {dateRange?.from
                      ? format(dateRange.from, "MMM d, yyyy")
                      : "Date Range"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Input
                placeholder="Filter appointments..."
                className="h-8 w-full border-sidebar-border bg-background px-2 text-xs sm:w-[250px] dark:bg-black"
              />
              {Object.entries(filterOptions).map(([filterName, options]) => (
                <Popover key={filterName}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="hidden h-8 shrink-0 gap-2 border-dashed border-sidebar-border !bg-background px-2 text-xs font-medium text-foreground hover:bg-accent md:flex dark:!bg-black dark:text-white dark:hover:bg-white/5"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      {filterName}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="flex w-[200px] flex-col gap-3 p-3"
                    align="start"
                  >
                    <div className="flex flex-col gap-2.5">
                      {options.map((option) => {
                        const id = `appointment-filter-${filterName}-${option}`
                        return (
                          <label
                            key={option}
                            htmlFor={id}
                            className="flex cursor-pointer items-center gap-2 text-xs"
                          >
                            <Checkbox
                              id={id}
                              checked={activeFilters[filterName]?.includes(
                                option
                              )}
                              onCheckedChange={() =>
                                toggleFilter(filterName, option)
                              }
                              className="h-3.5 w-3.5 rounded-[4px] border-sidebar-border"
                            />
                            {option}
                          </label>
                        )
                      })}
                    </div>
                    <Button
                      className="h-9 w-full text-xs"
                      onClick={() =>
                        setActiveFilters((current) => ({
                          ...current,
                          [filterName]: [],
                        }))
                      }
                    >
                      Clear Filter
                    </Button>
                  </PopoverContent>
                </Popover>
              ))}
              <Button
                variant="outline"
                className="flex h-8 shrink-0 gap-2 border-sidebar-border !bg-background px-2 text-xs font-medium md:hidden dark:!bg-black"
              >
                <Filter className="h-3.5 w-3.5" />
                Filter &amp; Export
              </Button>
            </div>
            <div className="flex w-full items-center gap-2 xl:w-auto">
              <DataExportModal
                title="Export Appointments"
                description="Download appointment records for the selected view."
                filename="baylan-appointments"
                headers={[
                  "Appointment ID",
                  "Patient Name",
                  "Practitioner",
                  "Appointment Type",
                  "Date",
                  "Time",
                  "Location",
                  "Status",
                ]}
                rows={appointments.map((appointment) => [
                  appointment.id,
                  appointment.patient,
                  appointment.practitioner,
                  appointment.type,
                  appointment.date,
                  appointment.time,
                  appointment.location,
                  appointment.status,
                ])}
              >
                <Button
                  variant="outline"
                  className="hidden h-8 gap-2 border-sidebar-border !bg-background px-2 text-xs font-medium md:flex dark:!bg-black"
                >
                  <Download className="h-3.5 w-3.5" /> Export
                </Button>
              </DataExportModal>
              <Button
                variant="outline"
                className="hidden h-8 gap-2 border-sidebar-border !bg-background px-2 text-xs font-medium md:flex dark:!bg-black"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Refresh
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-4 pb-24 pl-3 md:pt-0 md:pr-4 md:pb-4">
          <div className="hidden overflow-x-auto rounded-md border border-sidebar-border bg-background md:block dark:bg-black">
            <div className="min-w-[980px]">
              <Table>
                <TableHeader className="bg-card dark:bg-[#111]">
                  <TableRow className="border-sidebar-border hover:bg-transparent">
                    <TableHead className="w-10 px-2">
                      <Checkbox className="border-sidebar-border" />
                    </TableHead>
                    <TableHead className="px-2 text-xs font-medium">
                      Appointment ID
                    </TableHead>
                    <TableHead className="px-2 text-xs font-medium">
                      Patient Name
                    </TableHead>
                    <TableHead className="px-2 text-xs font-medium">
                      Appointment Type
                    </TableHead>
                    <TableHead className="px-2 text-xs font-medium">
                      Date &amp; Time
                    </TableHead>
                    <TableHead className="px-2 text-xs font-medium">
                      Location
                    </TableHead>
                    <TableHead className="px-2 text-xs font-medium">
                      Status
                    </TableHead>
                    <TableHead className="w-12 px-2" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow
                      key={appointment.id}
                      className="border-sidebar-border transition-colors hover:bg-accent dark:hover:bg-white/5"
                    >
                      <TableCell
                        className="px-2"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <Checkbox className="border-sidebar-border" />
                      </TableCell>
                      <TableCell className="p-2 text-xs font-medium">
                        {appointment.id}
                      </TableCell>
                      <TableCell className="p-2 text-xs">
                        {appointment.patient}
                      </TableCell>
                      <TableCell className="p-2 text-xs">
                        {appointment.type}
                      </TableCell>
                      <TableCell className="p-2 text-xs">
                        {appointment.date} · {appointment.time}
                      </TableCell>
                      <TableCell className="p-2 text-xs">
                        {appointment.location}
                      </TableCell>
                      <TableCell className="p-2">
                        <AppointmentStatus status={appointment.status} />
                      </TableCell>
                      <TableCell
                        className="p-2"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:hidden">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex flex-col gap-3 rounded-xl border border-sidebar-border bg-card p-4 text-left transition-colors hover:bg-accent dark:bg-[#111] dark:hover:bg-white/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground">
                      {appointment.id}
                    </p>
                    <h3 className="mt-1 text-sm font-medium">
                      {appointment.patient}
                    </h3>
                  </div>
                  <AppointmentStatus status={appointment.status} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Clock3 className="h-3.5 w-3.5" />
                    {appointment.time}
                  </span>
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {appointment.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function AppointmentStatus({ status }: { status: Appointment["status"] }) {
  const isPositive = status === "Confirmed" || status === "Completed"
  return (
    <Badge
      className={`gap-1 rounded-sm border px-1.5 py-0.5 text-[10px] text-white ${isPositive ? "border-[#22C55E]/20 bg-[#22C55E]" : status === "Cancelled" ? "border-[#ef4444]/20 bg-[#ef4444]" : "border-[#F59E0B]/20 bg-[#F59E0B]"}`}
    >
      {isPositive ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : (
        <CircleAlert className="h-3 w-3" />
      )}
      {status}
    </Badge>
  )
}
