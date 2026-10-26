import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Printer, Pill, Syringe, Wind, UserRound, MapPin, Building2 } from "lucide-react"

type Prescription = {
  id: string
  patient: string
  items: number
  unavailable: number
  issued: string
}

export function PrescriptionSidepeek({ prescription, onClose }: { prescription: Prescription | null, onClose: () => void }) {
  if (!prescription) return null

  return (
    <div className="flex h-full w-full flex-col border-l border-sidebar-border bg-background text-foreground dark:bg-[#111]">
      <div className="flex shrink-0 items-start justify-between border-b border-sidebar-border p-5">
        <div className="space-y-3">
          <h2 className="text-base font-semibold">{prescription.id}</h2>
          <Badge className="gap-1 bg-[#22c55e] text-white hover:bg-[#22c55e]"><span>●</span> Active</Badge>
        </div>
        <Button variant="ghost" size="icon" className="size-7" onClick={onClose} aria-label="Close prescription details"><X className="size-4" /></Button>
      </div>

      <div className="flex-1 overflow-y-auto text-sm">
        <section className="space-y-3 border-b border-sidebar-border p-5">
          <h3 className="font-medium">Clinical Encounter</h3>
          <p className="leading-relaxed text-muted-foreground">Payward in-patient prescription issued on October 13, 2026 for maintenance therapy and acute symptom management.</p>
        </section>

        <section className="space-y-5 border-b border-sidebar-border p-5">
          <div className="flex items-center justify-between"><h3 className="font-medium">Prescription Summary</h3><Button variant="secondary" size="sm" className="gap-2"><Printer className="size-4" />Print Rx</Button></div>
          <InfoRow icon={<Pill />} label="Total Prescribed Medications" value="9 Medicines" />
          <div className="space-y-4"><p className="text-xs text-muted-foreground">Dosage Form Breakdown</p><InfoRow icon={<Pill />} label="Oral Solid/Capsules" value="7 Items" /><InfoRow icon={<Syringe />} label="Injectables/SubQ" value="1 Item" /><InfoRow icon={<Wind />} label="Inhalation/Nebules" value="1 Item" /></div>
        </section>

        <section className="space-y-5 p-5">
          <h3 className="font-medium">Properties</h3>
          <div className="space-y-3"><p className="text-xs text-muted-foreground">Patient Information</p><InfoRow icon={<UserRound />} label="Patient Name" value={prescription.patient} /><InfoRow icon={<UserRound />} label="Age / Sex" value="25 M" /><InfoRow icon={<UserRound />} label="Pt. Health Record" value="[ HRN from Sheet ]" /><InfoRow icon={<MapPin />} label="Charge Slip" value="CS-101326" /><InfoRow icon={<MapPin />} label="Official Receipt" value="OR-884920" /><InfoRow icon={<MapPin />} label="Encounter Date" value="October 13, 2026" /></div>
          <div className="space-y-3"><p className="text-xs text-muted-foreground">Prescribed Items Summary</p><div className="overflow-hidden rounded-lg border border-sidebar-border"><div className="grid grid-cols-[1fr_90px_40px] gap-3 bg-muted/60 px-2 py-2 text-xs font-medium"><span>Generic Name</span><span>Stock Dose</span><span>QTY</span></div>{[1, 2, 3].map((item) => <div key={item} className="grid grid-cols-[1fr_90px_40px] gap-3 border-t border-sidebar-border px-2 py-3 text-xs"><span className="truncate">Insulin Glargine (Glysolin G) Pi...</span><span>50 MG</span><span>2</span></div>)}</div></div>
          <div className="space-y-3"><p className="text-xs text-muted-foreground">Hospital Location</p><InfoRow icon={<Building2 />} label="Healthcare Institution" value="Naga Imaging Center Cooperative" /><InfoRow icon={<MapPin />} label="Address" value="San Rene, Naga City, Camarines Sur" /><InfoRow icon={<UserRound />} label="Hospital Contact" value="09698678654" /><InfoRow icon={<UserRound />} label="Ward / Room" value="PAYWARD A" /></div>
        </section>
      </div>
      <div className="shrink-0 space-y-2 border-t border-sidebar-border p-5"><Button className="w-full">Print BMC Prescription Form</Button><Button variant="outline" className="w-full">Void Prescription</Button></div>
    </div>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return <div className="flex items-center gap-2"><span className="text-muted-foreground [&_svg]:size-4">{icon}</span><span className="min-w-0 flex-1 truncate text-muted-foreground">{label}</span><span className="min-w-0 flex-1 truncate">{value}</span></div>
}
