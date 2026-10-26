import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  X,
  CheckCircle2,
  Printer,
  Pill,
  Syringe,
  Wind,
  UserRound,
  MapPin,
  Building2,
  Stethoscope,
  ClipboardList,
  FileText,
  CalendarDays,
  Receipt,
  BedDouble,
  MoreVertical,
} from "lucide-react"

type Prescription = {
  id: string
  patient: string
  items: number
  unavailable: number
  issued: string
}

export function PrescriptionSidepeek({
  prescription,
  onClose,
}: {
  prescription: Prescription | null
  onClose: () => void
}) {
  const itemsTableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prescription) itemsTableRef.current?.scrollTo({ left: 0 })
  }, [prescription?.id])

  if (!prescription) return null

  return (
    <div className="flex h-full w-full flex-col border-l border-sidebar-border bg-background text-foreground dark:bg-[#0a0a0a] dark:bg-background">
      <div className="flex shrink-0 items-start justify-between border-b border-sidebar-border p-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-medium">{prescription.id}</h2>
          <Badge className="w-fit gap-1 rounded-sm border border-[#22C55E]/20 bg-[#22C55E] px-1.5 py-0.5 text-[10px] text-white hover:bg-[#22C55E]">
            <CheckCircle2 className="h-3 w-3" /> Active
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-foreground dark:text-white"
          onClick={onClose}
          aria-label="Close prescription details"
        >
          <X className="size-4" />
        </Button>
      </div>

      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto text-xs">
        <section className="space-y-3 border-b border-border p-4 dark:border-white/10">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-medium">Clinical Encounter</h3>
            <Stethoscope className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <p className="leading-relaxed text-muted-foreground">
            Payward in-patient prescription issued on October 13, 2026 for
            maintenance therapy and acute symptom management.
          </p>
        </section>

        <section className="space-y-4 border-b border-border p-4 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-medium">Prescription Summary</h3>
              <ClipboardList className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <Button variant="secondary" size="sm" className="h-7 gap-2 text-xs">
              <Printer className="size-3.5" />
              Print Rx
            </Button>
          </div>
          <InfoRow
            icon={<Pill />}
            label="Total Prescribed Medications"
            value="9 Medicines"
          />
          <div className="space-y-3">
            <p className="mt-2 text-[10px] text-muted-foreground">
              Dosage Form Breakdown
            </p>
            <InfoRow
              icon={<Pill />}
              label="Oral Solid/Capsules"
              value="7 Items"
            />
            <InfoRow
              icon={<Syringe />}
              label="Injectables/SubQ"
              value="1 Item"
            />
            <InfoRow
              icon={<Wind />}
              label="Inhalation/Nebules"
              value="1 Item"
            />
          </div>
        </section>

        <section className="space-y-4 p-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-medium">Properties</h3>
            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            <p className="text-[10px] text-muted-foreground">
              Patient Information
            </p>
            <InfoRow
              icon={<UserRound />}
              label="Patient Name"
              value={prescription.patient}
            />
            <InfoRow icon={<UserRound />} label="Age / Sex" value="25 M" />
            <InfoRow
              icon={<UserRound />}
              label="Pt. Health Record"
              value="[ HRN from Sheet ]"
            />
            <InfoRow icon={<Receipt />} label="Charge Slip" value="CS-101326" />
            <InfoRow
              icon={<Receipt />}
              label="Official Receipt"
              value="OR-884920"
            />
            <InfoRow
              icon={<CalendarDays />}
              label="Encounter Date"
              value="October 13, 2026"
            />
          </div>
          <div className="mt-2 space-y-3">
            <p className="text-[10px] text-muted-foreground">
              Prescribed Items Summary
            </p>
            <div
              ref={itemsTableRef}
              className="w-full max-w-full overflow-x-auto rounded-md border border-sidebar-border"
            >
              <div className="min-w-[560px]">
                <div className="grid grid-cols-[24px_180px_90px_40px_190px_24px] items-center gap-3 bg-muted px-2 py-2 text-xs font-medium dark:bg-black">
                  <span />
                  <span>Generic Name</span>
                  <span>Stock Dose</span>
                  <span>QTY</span>
                  <span>Dosage</span>
                  <span />
                </div>
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="grid grid-cols-[24px_180px_90px_40px_190px_24px] items-center gap-3 border-t border-sidebar-border px-2 py-2 text-xs"
                  >
                    <span className="h-4 w-4 rounded border border-sidebar-border" />
                    <span className="truncate">
                      Insulin Glargine (Glysolin G) Pi...
                    </span>
                    <span>50 MG</span>
                    <span className="w-fit rounded-md border border-sidebar-border px-1.5 py-0.5">
                      2
                    </span>
                    <span className="truncate">
                      ONCE A DAY for 2 days 10 Units
                    </span>
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-2 space-y-3">
            <p className="text-[10px] text-muted-foreground">
              Hospital Location
            </p>
            <InfoRow
              icon={<Building2 />}
              label="Healthcare Institution"
              value="Naga Imaging Center Cooperative (NICC) Doctors Hospital"
            />
            <InfoRow
              icon={<MapPin />}
              label="Address"
              value="San Rene, Naga City, Camarines Sur"
            />
            <InfoRow
              icon={<BedDouble />}
              label="Hospital Contact"
              value="09698678654"
            />
            <InfoRow
              icon={<UserRound />}
              label="Ward / Room"
              value="PAYWARD A"
            />
          </div>
          <div className="mt-2 space-y-3">
            <p className="text-[10px] text-muted-foreground">
              Prescriber Credentials
            </p>
            <InfoRow
              icon={<Building2 />}
              label="Attending Physician"
              value="Dr. Marc Lester E. Sulit, MD"
            />
            <InfoRow
              icon={<UserRound />}
              label="PRC License No."
              value="0161271"
            />
            <InfoRow
              icon={<UserRound />}
              label="PTR No."
              value="[PTR Number]"
            />
            <InfoRow
              icon={<UserRound />}
              label="S2 License No."
              value="N/A (Non-controlled Rx)"
            />
            <InfoRow
              icon={<CalendarDays />}
              label="Date Signed"
              value="10/13/2026"
            />
          </div>
        </section>
      </div>
      <div className="flex shrink-0 flex-col gap-3 border-t border-sidebar-border p-4 pb-8 md:pb-4">
        <Button className="h-8 w-full bg-primary text-xs font-medium text-primary-foreground hover:bg-zinc-200 dark:bg-white dark:text-black">
          Print BMC Prescription Form
        </Button>
        <Button
          variant="secondary"
          className="h-8 w-full border border-sidebar-border bg-muted text-xs font-medium dark:bg-[#1e1e1e] dark:text-white"
        >
          Void Prescription
        </Button>
      </div>
    </div>
  )
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center">
      <span className="flex w-[160px] shrink-0 items-center gap-2 text-muted-foreground [&_svg]:size-3.5">
        {icon}
        <span className="truncate text-xs">{label}</span>
      </span>
      <span className="min-w-0 flex-1 truncate">{value}</span>
    </div>
  )
}
