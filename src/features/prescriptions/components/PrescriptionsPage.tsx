import { useState } from "react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import {
  CheckCircle2,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CircleAlert,
  Download,
  Filter,
  MoreVertical,
  PlusCircle,
  RefreshCw,
  ScanQrCode,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import { PrescriptionSidepeek } from "./PrescriptionSidepeek"
import { CreatePrescriptionModal } from "./CreatePrescriptionModal"
import { ScanPrescriptionModal } from "./ScanPrescriptionModal"
import { DataExportModal } from "@/features/dashboard/components/DataExportModal"
import { useSearchParams } from "react-router-dom"

const prescriptions = [
  {
    id: "RX-2026-0849",
    patient: "Angelo Melicio Agawa",
    items: 2,
    unavailable: 3,
    issued: "Jun 08, 2026 - 10:45 AM",
  },
  {
    id: "RX-2026-0848",
    patient: "Daniel Cruz",
    items: 1,
    unavailable: 0,
    issued: "Jun 08, 2026 - 09:20 AM",
  },
  {
    id: "RX-2026-0847",
    patient: "Beatrice Flores",
    items: 4,
    unavailable: 1,
    issued: "Jun 07, 2026 - 03:15 PM",
  },
]

export function PrescriptionsPage() {
  const [searchParams] = useSearchParams()
  const isPharmacist =
    searchParams.get("role") === "pharmacist" ||
    window.localStorage.getItem("baylan-role") === "pharmacist"
  const [selected, setSelected] = useState<string[]>([])
  const [selectedPrescription, setSelectedPrescription] = useState<
    (typeof prescriptions)[number] | null
  >(null)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {}
  )
  const isMobile = useIsMobile()
  const filterOptions = {
    Status: ["Active", "Pending", "Cancelled"],
    Validity: ["Valid", "Expiring Soon", "Expired"],
  }

  const toggleFilter = (filterName: string, option: string) => {
    setActiveFilters((current) => {
      const selectedOptions = current[filterName] ?? []
      const nextOptions = selectedOptions.includes(option)
        ? selectedOptions.filter((item) => item !== option)
        : [...selectedOptions, option]

      return { ...current, [filterName]: nextOptions }
    })
  }

  const clearFilter = (filterName: string) => {
    setActiveFilters((current) => ({ ...current, [filterName]: [] }))
  }
  const toggleAll = (checked: boolean) =>
    setSelected(checked ? prescriptions.map((item) => item.id) : [])
  const toggleOne = (id: string, checked: boolean) =>
    setSelected((current) =>
      checked ? [...current, id] : current.filter((item) => item !== id)
    )

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
                  className="h-8 w-8 shrink-0 border-sidebar-border bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 shrink-0 border-sidebar-border bg-transparent px-3 text-xs font-medium"
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0 border-sidebar-border bg-transparent"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <h2 className="truncate text-lg font-semibold md:text-xl">
                June 2026
              </h2>
            </div>
            <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
              {isPharmacist && (
                <ScanPrescriptionModal>
                  <Button
                    variant="outline"
                    className="h-8 w-full gap-2 px-2 text-xs font-medium sm:w-auto"
                  >
                    <ScanQrCode className="h-3.5 w-3.5" />
                    Scan QR Code
                  </Button>
                </ScanPrescriptionModal>
              )}
              <CreatePrescriptionModal>
                <Button className="h-8 w-full gap-2 px-2 text-xs font-medium sm:w-auto">
                  <PlusCircle className="h-3.5 w-3.5" />
                  Create Prescription
                </Button>
              </CreatePrescriptionModal>
            </div>
          </div>
          <div className="-mb-2 flex w-full shrink-0 overflow-x-auto pb-2">
            <Tabs defaultValue="today" className="w-full md:w-max">
              <TabsList className="h-9 w-full justify-start gap-1 rounded-md border-none bg-muted p-1 md:w-max dark:bg-[#1e1e1e]">
                <TabsTrigger
                  value="today"
                  className="h-full rounded-sm border border-transparent px-2 py-1 text-xs font-medium text-muted-foreground transition-all hover:text-muted-foreground data-[state=active]:!border-border data-[state=active]:!bg-background data-[state=active]:text-foreground dark:text-white/70 dark:hover:text-foreground dark:data-[state=active]:!border-[#333] dark:data-[state=active]:!bg-black dark:data-[state=active]:text-white"
                >
                  Today
                </TabsTrigger>
                <TabsTrigger
                  value="all"
                  className="h-full rounded-sm border border-transparent px-2 py-1 text-xs font-medium text-muted-foreground transition-all hover:text-muted-foreground data-[state=active]:!border-border data-[state=active]:!bg-background data-[state=active]:text-foreground dark:text-white/70 dark:hover:text-foreground dark:data-[state=active]:!border-[#333] dark:data-[state=active]:!bg-black dark:data-[state=active]:text-white"
                >
                  All Records
                </TabsTrigger>
                <TabsTrigger
                  value="maintenance"
                  className="h-full rounded-sm border border-transparent px-2 py-1 text-xs font-medium text-muted-foreground transition-all hover:text-muted-foreground data-[state=active]:!border-border data-[state=active]:!bg-background data-[state=active]:text-foreground dark:text-white/70 dark:hover:text-foreground dark:data-[state=active]:!border-[#333] dark:data-[state=active]:!bg-black dark:data-[state=active]:text-white"
                >
                  Maintenance
                </TabsTrigger>
                <TabsTrigger
                  value="cancelled"
                  className="h-full rounded-sm border border-transparent px-2 py-1 text-xs font-medium text-muted-foreground transition-all hover:text-muted-foreground data-[state=active]:!border-border data-[state=active]:!bg-background data-[state=active]:text-foreground dark:text-white/70 dark:hover:text-foreground dark:data-[state=active]:!border-[#333] dark:data-[state=active]:!bg-black dark:data-[state=active]:text-white"
                >
                  Cancelled
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex flex-col items-start justify-between gap-4 xl:flex-row xl:items-center">
            <div className="flex w-full flex-wrap items-center gap-2 xl:w-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="hidden h-8 shrink-0 gap-2 border-dashed border-sidebar-border !bg-background px-2 text-xs font-medium text-foreground hover:bg-accent hover:text-foreground md:flex dark:!bg-black dark:text-white dark:hover:bg-white/5 dark:hover:text-foreground"
                  >
                    <CalendarRange className="h-3.5 w-3.5" />
                    {dateRange?.from
                      ? dateRange.to
                        ? `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d")}`
                        : format(dateRange.from, "MMM d, yyyy")
                      : "Date Range"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={1}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <div className="flex w-full items-center gap-2 md:w-auto">
                <Input
                  placeholder="Filter prescriptions..."
                  className="h-8 w-full border-sidebar-border bg-background px-2 text-xs font-normal sm:w-[250px] dark:bg-black"
                />
              </div>
              {Object.entries(filterOptions).map(([filterName, options]) => (
                <Popover key={filterName}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="hidden h-8 shrink-0 gap-2 border-dashed border-sidebar-border !bg-background px-2 text-xs font-medium text-foreground hover:bg-accent hover:text-foreground md:flex dark:!bg-black dark:text-white dark:hover:bg-white/5 dark:hover:text-foreground"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      {filterName}
                      {(activeFilters[filterName]?.length ?? 0) > 0 && (
                        <span className="text-[10px] text-muted-foreground">
                          {activeFilters[filterName].length}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="flex w-[200px] flex-col gap-3 p-3"
                    align="start"
                  >
                    <div className="flex flex-col gap-2.5">
                      {options.map((option) => {
                        const id = `filter-${filterName}-${option}`
                        return (
                          <div key={option} className="flex items-center gap-2">
                            <Checkbox
                              id={id}
                              checked={activeFilters[filterName]?.includes(
                                option
                              )}
                              onCheckedChange={() =>
                                toggleFilter(filterName, option)
                              }
                              className="h-3.5 w-3.5 rounded-[4px] border-sidebar-border data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:border-white dark:data-[state=checked]:bg-white dark:data-[state=checked]:text-black"
                            />
                            <label
                              htmlFor={id}
                              className="cursor-pointer text-xs leading-none font-normal text-foreground dark:text-white"
                            >
                              {option}
                            </label>
                          </div>
                        )
                      })}
                    </div>
                    <Button
                      className="h-9 w-full bg-primary text-xs text-primary-foreground hover:bg-primary/90 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                      onClick={() => clearFilter(filterName)}
                    >
                      Clear Filter
                    </Button>
                  </PopoverContent>
                </Popover>
              ))}
              <Button
                variant="outline"
                className="flex h-8 shrink-0 gap-2 border-sidebar-border !bg-background px-2 text-xs font-medium text-foreground hover:bg-accent hover:text-foreground md:hidden dark:!bg-black dark:text-white dark:hover:bg-white/5 dark:hover:text-foreground"
              >
                <Filter className="h-3.5 w-3.5" />
                Filter &amp; Export
              </Button>
            </div>
            <div className="flex w-full items-center gap-2 xl:w-auto">
              <DataExportModal
                title="Export Prescriptions"
                description="Download prescription records for the selected view."
                filename="baylan-prescriptions"
                headers={[
                  "Prescription ID",
                  "Patient Name",
                  "Items",
                  "Unavailable",
                  "Issued Date & Time",
                  "Validity",
                ]}
                rows={prescriptions.map((prescription) => [
                  prescription.id,
                  prescription.patient,
                  prescription.items,
                  prescription.unavailable,
                  prescription.issued,
                  "Active",
                ])}
              >
                <Button
                  variant="outline"
                  className="hidden h-8 shrink-0 gap-2 border-sidebar-border !bg-background px-2 text-xs font-medium text-foreground hover:bg-accent hover:text-foreground md:flex dark:!bg-black dark:text-white dark:hover:bg-white/5 dark:hover:text-foreground"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export
                </Button>
              </DataExportModal>
              <Button
                variant="outline"
                className="hidden h-8 shrink-0 gap-2 border-sidebar-border !bg-background px-2 text-xs font-medium text-foreground hover:bg-accent hover:text-foreground md:flex dark:!bg-black dark:text-white dark:hover:bg-white/5 dark:hover:text-foreground"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-sidebar-border pt-3 text-xs text-muted-foreground md:hidden">
            <span>Page 1 of 1</span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                disabled
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-4 pr-4 pb-24 pl-3 md:pt-0 md:pb-4">
          <div className="hidden overflow-x-auto rounded-md border border-sidebar-border bg-background md:block dark:bg-black">
            <div className="min-w-[920px]">
              <Table>
                <TableHeader className="bg-card dark:bg-[#111]">
                  <TableRow className="border-sidebar-border hover:bg-transparent">
                    <TableHead className="w-12 pl-4 text-center">
                      <Checkbox
                        checked={selected.length === prescriptions.length}
                        onCheckedChange={(checked) =>
                          toggleAll(checked === true)
                        }
                        aria-label="Select all prescriptions"
                      />
                    </TableHead>
                    <TableHead className="text-xs font-medium whitespace-nowrap text-foreground dark:text-white">
                      RX Identifier
                    </TableHead>
                    <TableHead className="text-xs font-medium whitespace-nowrap text-foreground dark:text-white">
                      Patient Name
                    </TableHead>
                    <TableHead className="text-xs font-medium whitespace-nowrap text-foreground dark:text-white">
                      Item Summary
                    </TableHead>
                    <TableHead className="text-xs font-medium whitespace-nowrap text-foreground dark:text-white">
                      Items Unavailable
                    </TableHead>
                    <TableHead className="text-xs font-medium whitespace-nowrap text-foreground dark:text-white">
                      Issued Date &amp; Time
                    </TableHead>
                    <TableHead className="text-xs font-medium whitespace-nowrap text-foreground dark:text-white">
                      Validity
                    </TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prescriptions.map((prescription) => (
                    <TableRow
                      key={prescription.id}
                      className={`group cursor-pointer border-sidebar-border transition-colors ${selectedPrescription?.id === prescription.id ? "bg-accent dark:bg-white/10" : "hover:bg-accent dark:hover:bg-white/5"}`}
                      onClick={() => setSelectedPrescription(prescription)}
                    >
                      <TableCell
                        className="pl-4"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <Checkbox
                          checked={selected.includes(prescription.id)}
                          onCheckedChange={(checked) =>
                            toggleOne(prescription.id, checked === true)
                          }
                          aria-label={`Select ${prescription.id}`}
                        />
                      </TableCell>
                      <TableCell className="text-xs font-medium whitespace-nowrap text-foreground dark:text-white">
                        {prescription.id}
                      </TableCell>
                      <TableCell className="text-xs whitespace-nowrap text-foreground dark:text-white">
                        {prescription.patient}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="w-fit rounded-sm text-[10px] font-normal"
                        >
                          {prescription.items}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {prescription.unavailable > 0 ? (
                          <Badge className="w-fit gap-1 rounded-sm border border-[#ff7373]/20 bg-[#ff7373] px-1.5 py-0.5 text-[10px] text-white hover:bg-[#ff7373]">
                            <CircleAlert className="h-3 w-3" />
                            {prescription.unavailable}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs whitespace-nowrap text-muted-foreground">
                        {prescription.issued}
                      </TableCell>
                      <TableCell>
                        <Badge className="w-fit gap-1 rounded-sm border border-[#22C55E]/20 bg-[#22C55E] px-1.5 py-0.5 text-[10px] text-white hover:bg-[#22C55E]">
                          <CheckCircle2 className="h-3 w-3" />
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell onClick={(event) => event.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-foreground dark:text-white"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-[200px] rounded-xl border-border shadow-md"
                          >
                            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                              Actions
                            </DropdownMenuLabel>
                            <DropdownMenuItem
                              className="cursor-pointer rounded-md text-xs"
                              onClick={() =>
                                setSelectedPrescription(prescription)
                              }
                            >
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer rounded-md text-xs">
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer rounded-md text-xs text-destructive">
                              Cancel prescription
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="flex flex-col gap-3 md:hidden">
            {prescriptions.map((prescription) => (
              <div
                key={prescription.id}
                className={`flex cursor-pointer flex-col gap-3 rounded-xl border border-sidebar-border bg-card p-4 transition-colors dark:bg-[#111] ${selectedPrescription?.id === prescription.id ? "ring-1 ring-ring dark:ring-white/20" : "hover:bg-accent dark:hover:bg-white/5"}`}
                onClick={() => setSelectedPrescription(prescription)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold">{prescription.id}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {prescription.patient}
                    </p>
                  </div>
                  <Badge className="gap-1 rounded-sm border border-[#22C55E]/20 bg-[#22C55E] px-1.5 py-0.5 text-[10px] text-white">
                    <CheckCircle2 className="h-3 w-3" />
                    Active
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 border-t border-sidebar-border pt-3 text-xs">
                  <span className="text-muted-foreground">Items</span>
                  <span>{prescription.items}</span>
                  <span className="text-muted-foreground">Unavailable</span>
                  <span>{prescription.unavailable || "—"}</span>
                  <span className="text-muted-foreground">Issued</span>
                  <span>{prescription.issued}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden flex-row items-center justify-between gap-4 text-xs text-muted-foreground md:flex">
            <span>
              {selected.length} of {prescriptions.length} row(s) selected.
            </span>
            <div className="flex items-center gap-4">
              <span>
                Rows per page{" "}
                <Button
                  variant="outline"
                  className="ml-2 h-7 w-14 px-2 text-xs"
                >
                  10⌄
                </Button>
              </span>
              <span>Page 1 of 1</span>
              <div className="flex gap-1">
                {[ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight].map(
                  (Icon, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      disabled={index < 2}
                    >
                      <Icon className="h-3 w-3" />
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {!isMobile && (
        <div
          className={`fixed top-0 right-0 z-50 h-screen w-full shadow-2xl transition-transform duration-300 sm:w-[400px] ${selectedPrescription ? "translate-x-0" : "translate-x-full"}`}
        >
          <PrescriptionSidepeek
            key={selectedPrescription?.id ?? "empty"}
            prescription={selectedPrescription}
            onClose={() => setSelectedPrescription(null)}
          />
        </div>
      )}
      {isMobile && (
        <Drawer
          open={!!selectedPrescription}
          onOpenChange={(open) => !open && setSelectedPrescription(null)}
        >
          <DrawerContent className="h-[80dvh] overflow-hidden rounded-t-xl border-t border-sidebar-border bg-background p-0 before:hidden">
            <div className="sr-only">
              <DrawerTitle>Prescription Details</DrawerTitle>
            </div>
            <PrescriptionSidepeek
              key={selectedPrescription?.id ?? "empty-mobile"}
              prescription={selectedPrescription}
              onClose={() => setSelectedPrescription(null)}
            />
          </DrawerContent>
        </Drawer>
      )}
    </div>
  )
}
