import { useState } from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Download, MoreHorizontal, Plus, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import { PrescriptionSidepeek } from "./PrescriptionSidepeek"

const prescriptions = [
  { id: "RX-2026-0849", patient: "Mara Elena Santos", items: 2, unavailable: 3, issued: "Jun 08, 2026 - 10:45 AM" },
  { id: "RX-2026-0848", patient: "Daniel Cruz", items: 1, unavailable: 0, issued: "Jun 08, 2026 - 09:20 AM" },
  { id: "RX-2026-0847", patient: "Beatrice Flores", items: 4, unavailable: 1, issued: "Jun 07, 2026 - 03:15 PM" },
]

export function PrescriptionsPage() {
  const [selected, setSelected] = useState<string[]>([])
  const [selectedPrescription, setSelectedPrescription] = useState<typeof prescriptions[number] | null>(null)
  const isMobile = useIsMobile()
  const allSelected = selected.length === prescriptions.length

  const toggleAll = (checked: boolean) => setSelected(checked ? prescriptions.map((item) => item.id) : [])
  const toggleOne = (id: string, checked: boolean) => setSelected((current) => checked ? [...current, id] : current.filter((item) => item !== id))

  return (
    <main className="min-h-full bg-background p-4 text-foreground md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="size-9"><ChevronLeft /></Button>
          <Button variant="outline" className="h-9 px-4">Today</Button>
          <Button variant="outline" size="icon" className="size-9"><ChevronRight /></Button>
          <h1 className="ml-1 text-2xl font-semibold tracking-tight">June 2026</h1>
        </div>
        <Button className="h-9 gap-2"><Plus className="size-4" />Create Prescription</Button>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Tabs defaultValue="today">
          <TabsList className="h-9 rounded-lg border bg-muted/50 p-0.5">
            <TabsTrigger value="today" className="h-8 px-3 text-xs">Today</TabsTrigger>
            <TabsTrigger value="all" className="h-8 px-3 text-xs">All Records</TabsTrigger>
            <TabsTrigger value="maintenance" className="h-8 px-3 text-xs">Maintenance</TabsTrigger>
            <TabsTrigger value="cancelled" className="h-8 px-3 text-xs">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex gap-2">
          <Button variant="outline" className="h-9 gap-2 text-xs"><Download className="size-3.5" />Export</Button>
          <Button variant="outline" className="h-9 gap-2 text-xs"><RefreshCw className="size-3.5" />Refresh</Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="grid min-w-[920px] grid-cols-[44px_1.1fr_1.2fr_1.1fr_1fr_1.4fr_1fr_48px] items-center gap-3 bg-muted/60 px-2 py-3 text-xs font-medium text-muted-foreground">
          <Checkbox checked={allSelected} onCheckedChange={(checked) => toggleAll(checked === true)} aria-label="Select all prescriptions" />
          <span>RX Identifier</span><span>Patient Name</span><span>Item Summary</span><span>Items Unavailable</span><span>Issued Date &amp; Time</span><span>Validity</span><span />
        </div>
        {prescriptions.map((prescription) => (
          <div key={prescription.id} role="button" tabIndex={0} onClick={() => setSelectedPrescription(prescription)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setSelectedPrescription(prescription) }} className={`grid min-w-[920px] cursor-pointer grid-cols-[44px_1.1fr_1.2fr_1.1fr_1fr_1.4fr_1fr_48px] items-center gap-3 border-t px-2 py-4 text-sm transition-colors hover:bg-muted/40 ${selectedPrescription?.id === prescription.id ? "bg-muted/50" : ""}`}>
            <div onClick={(event) => event.stopPropagation()}><Checkbox checked={selected.includes(prescription.id)} onCheckedChange={(checked) => toggleOne(prescription.id, checked === true)} aria-label={`Select ${prescription.id}`} /></div>
            <span className="font-medium">{prescription.id}</span>
            <span>{prescription.patient}</span>
            <Badge variant="outline" className="w-fit font-normal">{prescription.items}</Badge>
            {prescription.unavailable > 0 ? <Badge className="w-fit bg-[#ff6870] text-white hover:bg-[#ff6870]"><span className="mr-1">⊘</span>{prescription.unavailable}</Badge> : <span className="text-muted-foreground">—</span>}
            <span className="text-muted-foreground">{prescription.issued}</span>
            <Badge className="w-fit bg-[#22c55e] text-white hover:bg-[#22c55e]">●&nbsp; Active</Badge>
            <div onClick={(event) => event.stopPropagation()}><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-8"><MoreHorizontal /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => setSelectedPrescription(prescription)}>View details</DropdownMenuItem><DropdownMenuItem>Download</DropdownMenuItem><DropdownMenuItem className="text-destructive">Cancel prescription</DropdownMenuItem></DropdownMenuContent></DropdownMenu></div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 py-4 text-sm text-muted-foreground">
        <span>{selected.length} of {prescriptions.length} row(s) selected.</span>
        <div className="flex items-center gap-5"><span>Rows per page <Button variant="outline" className="ml-2 h-9 w-16 justify-between px-3 text-xs">10⌄</Button></span><span>Page 1 of 1</span><div className="flex gap-1"><Button variant="outline" size="icon" className="size-9" disabled><ChevronsLeft /></Button><Button variant="outline" size="icon" className="size-9" disabled><ChevronLeft /></Button><Button variant="outline" size="icon" className="size-9"><ChevronRight /></Button><Button variant="outline" size="icon" className="size-9"><ChevronsRight /></Button></div></div>
      </div>

      {!isMobile && <div className={`fixed top-0 right-0 z-50 h-screen w-full shadow-2xl transition-transform duration-300 sm:w-[440px] ${selectedPrescription ? "translate-x-0" : "translate-x-full"}`}><PrescriptionSidepeek prescription={selectedPrescription} onClose={() => setSelectedPrescription(null)} /></div>}
      {isMobile && <Drawer open={!!selectedPrescription} onOpenChange={(open) => !open && setSelectedPrescription(null)}><DrawerContent className="h-[80dvh] overflow-hidden rounded-t-xl border-t border-sidebar-border bg-background p-0 before:hidden"><div className="sr-only"><DrawerTitle>Prescription Details</DrawerTitle></div><PrescriptionSidepeek prescription={selectedPrescription} onClose={() => setSelectedPrescription(null)} /></DrawerContent></Drawer>}
    </main>
  )
}
