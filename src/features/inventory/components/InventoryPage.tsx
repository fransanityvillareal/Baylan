import { useEffect, useMemo, useState } from "react"
import type { FormEvent } from "react"
import {
  Archive,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Download,
  Edit3,
  Filter,
  Minus,
  MoreVertical,
  Package,
  Plus,
  PlusCircle,
  RefreshCw,
  Trash2,
  Warehouse,
} from "lucide-react"
import { ResponsiveModal } from "@/components/ui/responsive-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { DataExportModal } from "@/features/dashboard/components/DataExportModal"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type InventoryStatus = "Active" | "Inactive" | "Discontinued"
type Availability = "In Stock" | "Low Stock" | "Out of Stock"

type Medicine = {
  id: string
  genericName: string
  brandName: string
  displayName: string
  strength: string
  dosageForm: string
  route: string
  category: string
  manufacturer: string
  fdaRegistrationNumber: string
  prescriptionRequired: boolean
  packageType: string
  packageQuantity: string
  packageUnit: string
  sellingPrice: number
  currency: string
  stockQuantity: number
  reservedQuantity: number
  unitOfSale: string
  batchNumber: string
  expirationDate: string
  reorderLevel: number
  status: InventoryStatus
  availabilityStatus: Availability
  description: string
}

const initialMedicines: Medicine[] = [
  {
    id: "med_001",
    genericName: "Paracetamol",
    brandName: "",
    displayName: "Paracetamol 500 mg Tablet",
    strength: "500 mg",
    dosageForm: "Tablet",
    route: "Oral",
    category: "Analgesic / Antipyretic",
    manufacturer: "",
    fdaRegistrationNumber: "",
    prescriptionRequired: false,
    packageType: "Box",
    packageQuantity: "100",
    packageUnit: "Tablets",
    sellingPrice: 2.5,
    currency: "PHP",
    stockQuantity: 245,
    reservedQuantity: 18,
    unitOfSale: "Tablet",
    batchNumber: "PCM-2603-A",
    expirationDate: "2027-03-31",
    reorderLevel: 50,
    status: "Active",
    availabilityStatus: "In Stock",
    description: "For the temporary relief of minor aches and fever.",
  },
  {
    id: "med_002",
    genericName: "Amoxicillin",
    brandName: "",
    displayName: "Amoxicillin 500 mg Capsule",
    strength: "500 mg",
    dosageForm: "Capsule",
    route: "Oral",
    category: "Antibiotic",
    manufacturer: "",
    fdaRegistrationNumber: "",
    prescriptionRequired: true,
    packageType: "Box",
    packageQuantity: "20",
    packageUnit: "Capsules",
    sellingPrice: 12,
    currency: "PHP",
    stockQuantity: 24,
    reservedQuantity: 8,
    unitOfSale: "Capsule",
    batchNumber: "AMX-2512-B",
    expirationDate: "2026-12-15",
    reorderLevel: 30,
    status: "Active",
    availabilityStatus: "Low Stock",
    description: "Prescription antibiotic capsule.",
  },
  {
    id: "med_003",
    genericName: "Insulin Glargine",
    brandName: "Glysolin G",
    displayName: "Insulin Glargine 50 MG Injection",
    strength: "50 MG",
    dosageForm: "Injection",
    route: "Subcutaneous",
    category: "Antidiabetic",
    manufacturer: "",
    fdaRegistrationNumber: "",
    prescriptionRequired: true,
    packageType: "Vial",
    packageQuantity: "1",
    packageUnit: "Vial",
    sellingPrice: 840,
    currency: "PHP",
    stockQuantity: 0,
    reservedQuantity: 0,
    unitOfSale: "Vial",
    batchNumber: "INS-2508-C",
    expirationDate: "2026-08-30",
    reorderLevel: 10,
    status: "Active",
    availabilityStatus: "Out of Stock",
    description: "Long-acting insulin for diabetes management.",
  },
]

const filterOptions = {
  "Dosage Form": ["Tablet", "Capsule", "Syrup", "Injection", "Cream"],
  Availability: ["In Stock", "Low Stock", "Out of Stock"],
}

export function InventoryPage() {
  const [medicines, setMedicines] = useState(initialMedicines)
  const [activeTab, setActiveTab] = useState("all")
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<Record<string, string[]>>({})
  const [formOpen, setFormOpen] = useState(false)
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null)
  const [stockMedicine, setStockMedicine] = useState<Medicine | null>(null)
  const [deleteMedicine, setDeleteMedicine] = useState<Medicine | null>(null)

  const visibleMedicines = useMemo(
    () =>
      medicines.filter((medicine) => {
        const matchesSearch = [
          medicine.displayName,
          medicine.genericName,
          medicine.brandName,
          medicine.batchNumber,
        ]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
        const matchesTab =
          activeTab === "all" ||
          (activeTab === "low-stock" &&
            medicine.availabilityStatus === "Low Stock") ||
          (activeTab === "out-of-stock" &&
            medicine.availabilityStatus === "Out of Stock") ||
          (activeTab === "inactive" && medicine.status !== "Active")
        const matchesFilters = Object.entries(filters).every(
          ([key, values]) => {
            if (!values.length) return true
            const value =
              key === "Dosage Form"
                ? medicine.dosageForm
                : medicine.availabilityStatus
            return values.includes(value)
          }
        )
        return matchesSearch && matchesTab && matchesFilters
      }),
    [activeTab, filters, medicines, search]
  )

  const saveMedicine = (medicine: Medicine) => {
    setMedicines((current) =>
      editingMedicine
        ? current.map((item) => (item.id === medicine.id ? medicine : item))
        : [medicine, ...current]
    )
    setFormOpen(false)
    setEditingMedicine(null)
  }

  const adjustStock = (
    id: string,
    stockQuantity: number,
    reservedQuantity: number
  ) => {
    setMedicines((current) =>
      current.map((medicine) => {
        if (medicine.id !== id) return medicine
        return {
          ...medicine,
          stockQuantity,
          reservedQuantity,
          availabilityStatus:
            stockQuantity === 0
              ? "Out of Stock"
              : stockQuantity <= medicine.reorderLevel
                ? "Low Stock"
                : "In Stock",
        }
      })
    )
    setStockMedicine(null)
  }

  const exportRows = (records: Medicine[]) =>
    records.map((medicine) => [
      medicine.displayName,
      medicine.genericName,
      medicine.dosageForm,
      medicine.sellingPrice,
      medicine.stockQuantity,
      medicine.reservedQuantity,
      medicine.expirationDate,
      medicine.availabilityStatus,
    ])

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
                Inventory
              </h2>
            </div>
            <Button
              className="h-8 w-full gap-2 px-2 text-xs font-medium md:w-auto"
              onClick={() => {
                setEditingMedicine(null)
                setFormOpen(true)
              }}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              Add Medicine
            </Button>
          </div>

          <div className="-mb-2 flex w-full shrink-0 overflow-x-auto pb-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full md:w-max"
            >
              <TabsList className="h-9 w-full justify-start gap-1 rounded-md border-none bg-muted p-1 md:w-max dark:bg-[#1e1e1e]">
                {[
                  ["all", "All Medicines"],
                  ["low-stock", "Low Stock"],
                  ["out-of-stock", "Out of Stock"],
                  ["inactive", "Inactive"],
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
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Filter medicines..."
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
                        const id = `inventory-filter-${filterName}-${option}`
                        return (
                          <label
                            key={option}
                            htmlFor={id}
                            className="flex cursor-pointer items-center gap-2 text-xs"
                          >
                            <Checkbox
                              id={id}
                              checked={filters[filterName]?.includes(option)}
                              onCheckedChange={() =>
                                setFilters((current) => ({
                                  ...current,
                                  [filterName]: current[filterName]?.includes(
                                    option
                                  )
                                    ? current[filterName].filter(
                                        (item) => item !== option
                                      )
                                    : [...(current[filterName] ?? []), option],
                                }))
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
                        setFilters((current) => ({
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
                title="Export Inventory"
                description="Download the medicine and stock records for your pharmacy."
                filename="baylan-inventory"
                headers={[
                  "Medicine",
                  "Generic Name",
                  "Dosage Form",
                  "Price",
                  "Stock",
                  "Reserved",
                  "Expiry",
                  "Status",
                ]}
                rows={exportRows(visibleMedicines)}
                allRows={exportRows(medicines)}
              >
                <Button
                  variant="outline"
                  className="hidden h-8 gap-2 border-sidebar-border !bg-background px-2 text-xs font-medium md:flex dark:!bg-black"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export
                </Button>
              </DataExportModal>
              <Button
                variant="outline"
                className="hidden h-8 gap-2 border-sidebar-border !bg-background px-2 text-xs font-medium md:flex dark:!bg-black"
                onClick={() => {
                  setMedicines(initialMedicines)
                  setSearch("")
                  setFilters({})
                  setActiveTab("all")
                }}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-4 pb-24 pl-3 md:pt-0 md:pr-4 md:pb-4">
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <SummaryCard
              icon={<Package />}
              label="Catalog Items"
              value={medicines.length.toString()}
            />
            <SummaryCard
              icon={<Warehouse />}
              label="In Stock"
              value={medicines
                .filter((item) => item.availabilityStatus === "In Stock")
                .length.toString()}
            />
            <SummaryCard
              icon={<CircleAlert />}
              label="Low / Out"
              value={medicines
                .filter((item) => item.availabilityStatus !== "In Stock")
                .length.toString()}
            />
            <SummaryCard
              icon={<Archive />}
              label="Reserved Units"
              value={medicines
                .reduce((sum, item) => sum + item.reservedQuantity, 0)
                .toString()}
            />
          </div>
          <div className="hidden overflow-x-auto rounded-md border border-sidebar-border bg-background md:block dark:bg-black">
            <div className="min-w-[1160px]">
              <Table>
                <TableHeader className="bg-card dark:bg-[#111]">
                  <TableRow className="border-sidebar-border hover:bg-transparent">
                    <TableHead className="w-10 px-2">
                      <Checkbox className="border-sidebar-border" />
                    </TableHead>
                    <TableHead className="px-2 text-xs font-medium">
                      Medicine
                    </TableHead>
                    <TableHead className="px-2 text-xs font-medium">
                      Form / Strength
                    </TableHead>
                    <TableHead className="px-2 text-xs font-medium">
                      Price
                    </TableHead>
                    <TableHead className="px-2 text-xs font-medium">
                      Stock
                    </TableHead>
                    <TableHead className="px-2 text-xs font-medium">
                      Reserved
                    </TableHead>
                    <TableHead className="px-2 text-xs font-medium">
                      Batch / Expiry
                    </TableHead>
                    <TableHead className="px-2 text-xs font-medium">
                      Availability
                    </TableHead>
                    <TableHead className="w-12 px-2" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleMedicines.map((medicine) => (
                    <MedicineRow
                      key={medicine.id}
                      medicine={medicine}
                      onEdit={() => {
                        setEditingMedicine(medicine)
                        setFormOpen(true)
                      }}
                      onStock={() => setStockMedicine(medicine)}
                      onDelete={() => setDeleteMedicine(medicine)}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="flex flex-col gap-3 md:hidden">
            {visibleMedicines.map((medicine) => (
              <MedicineCard
                key={medicine.id}
                medicine={medicine}
                onEdit={() => {
                  setEditingMedicine(medicine)
                  setFormOpen(true)
                }}
                onStock={() => setStockMedicine(medicine)}
                onDelete={() => setDeleteMedicine(medicine)}
              />
            ))}
          </div>
          {visibleMedicines.length === 0 && (
            <div className="flex min-h-40 items-center justify-center rounded-md border border-dashed border-sidebar-border text-xs text-muted-foreground">
              No medicines match the current filters.
            </div>
          )}
        </div>
      </div>
      <MedicineFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        medicine={editingMedicine}
        onSave={saveMedicine}
      />
      <StockAdjustmentModal
        medicine={stockMedicine}
        onClose={() => setStockMedicine(null)}
        onAdjust={adjustStock}
      />
      <AlertDialog
        open={!!deleteMedicine}
        onOpenChange={(open) => !open && setDeleteMedicine(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete medicine?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes {deleteMedicine?.displayName} from this pharmacy
              inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
              onClick={() => {
                if (deleteMedicine)
                  setMedicines((current) =>
                    current.filter((item) => item.id !== deleteMedicine.id)
                  )
                setDeleteMedicine(null)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function MedicineRow({
  medicine,
  onEdit,
  onStock,
  onDelete,
}: {
  medicine: Medicine
  onEdit: () => void
  onStock: () => void
  onDelete: () => void
}) {
  return (
    <TableRow className="border-sidebar-border transition-colors hover:bg-accent dark:hover:bg-white/5">
      <TableCell className="px-2">
        <Checkbox className="border-sidebar-border" />
      </TableCell>
      <TableCell className="p-2">
        <div className="text-xs font-medium">{medicine.displayName}</div>
        <div className="text-[10px] text-muted-foreground">
          {medicine.genericName}
          {medicine.prescriptionRequired ? " · Rx required" : ""}
        </div>
      </TableCell>
      <TableCell className="p-2 text-xs">
        {medicine.dosageForm} · {medicine.strength}
        <div className="text-[10px] text-muted-foreground">
          {medicine.route}
        </div>
      </TableCell>
      <TableCell className="p-2 text-xs">
        {medicine.currency} {medicine.sellingPrice.toFixed(2)}
        <div className="text-[10px] text-muted-foreground">
          per {medicine.unitOfSale}
        </div>
      </TableCell>
      <TableCell
        className="cursor-pointer p-2 text-xs transition-colors hover:bg-accent dark:hover:bg-white/5"
        onClick={onStock}
      >
        {medicine.stockQuantity}
        <div className="text-[10px] text-muted-foreground">
          reorder at {medicine.reorderLevel}
        </div>
      </TableCell>
      <TableCell className="p-2 text-xs">{medicine.reservedQuantity}</TableCell>
      <TableCell className="p-2 text-xs">
        {medicine.batchNumber}
        <div className="text-[10px] text-muted-foreground">
          expires {medicine.expirationDate}
        </div>
      </TableCell>
      <TableCell className="p-2">
        <AvailabilityBadge status={medicine.availabilityStatus} />
      </TableCell>
      <TableCell className="p-2">
        <MedicineActions
          onEdit={onEdit}
          onStock={onStock}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  )
}

function MedicineCard({
  medicine,
  onEdit,
  onStock,
  onDelete,
}: {
  medicine: Medicine
  onEdit: () => void
  onStock: () => void
  onDelete: () => void
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-sidebar-border bg-card p-4 dark:bg-[#111]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] text-muted-foreground">{medicine.id}</p>
          <h3 className="mt-1 text-sm font-medium">{medicine.displayName}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {medicine.genericName} · {medicine.dosageForm}
          </p>
        </div>
        <AvailabilityBadge status={medicine.availabilityStatus} />
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <span>
          Price: {medicine.currency} {medicine.sellingPrice.toFixed(2)}
        </span>
        <span>Stock: {medicine.stockQuantity}</span>
        <span>Expiry: {medicine.expirationDate}</span>
        <span>Reserved: {medicine.reservedQuantity}</span>
      </div>
      <div className="flex gap-2 border-t border-sidebar-border pt-3">
        <Button
          variant="outline"
          className="h-8 flex-1 gap-1.5 text-xs"
          onClick={onStock}
        >
          <Plus className="h-3.5 w-3.5" />
          Stock
        </Button>
        <Button
          variant="outline"
          className="h-8 flex-1 gap-1.5 text-xs"
          onClick={onEdit}
        >
          <Edit3 className="h-3.5 w-3.5" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}

function MedicineActions({
  onEdit,
  onStock,
  onDelete,
}: {
  onEdit: () => void
  onStock: () => void
  onDelete: () => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px] rounded-xl">
        <DropdownMenuItem className="gap-2 text-xs" onClick={onEdit}>
          <Edit3 className="h-3.5 w-3.5" />
          Edit medicine
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 text-xs" onClick={onStock}>
          <Plus className="h-3.5 w-3.5" />
          Adjust stock
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 text-xs text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete medicine
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function AvailabilityBadge({ status }: { status: Availability }) {
  const positive = status === "In Stock"
  return (
    <Badge
      className={`gap-1 rounded-sm border px-1.5 py-0.5 text-[10px] text-white ${positive ? "border-[#22C55E]/20 bg-[#22C55E]" : status === "Out of Stock" ? "border-[#ef4444]/20 bg-[#ef4444]" : "border-[#F59E0B]/20 bg-[#F59E0B]"}`}
    >
      {positive ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : (
        <CircleAlert className="h-3 w-3" />
      )}
      {status}
    </Badge>
  )
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-sidebar-border bg-card p-3 dark:bg-[#111]">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground dark:bg-white/10 [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="truncate text-[10px] text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  )
}

function MedicineFormModal({
  open,
  onOpenChange,
  medicine,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  medicine: Medicine | null
  onSave: (medicine: Medicine) => void
}) {
  const [form, setForm] = useState<Medicine>(
    () => medicine ?? createBlankMedicine()
  )
  const [step, setStep] = useState("identity")
  const current = form

  useEffect(() => {
    if (open) {
      setForm(medicine ?? createBlankMedicine())
      setStep("identity")
    }
  }, [medicine, open])

  const handleOpenChange = (value: boolean) => {
    onOpenChange(value)
  }
  const update = (field: keyof Medicine, value: string | boolean | number) =>
    setForm((current) => ({ ...current, [field]: value }))
  const submit = (event: FormEvent) => {
    event.preventDefault()
    const availabilityStatus =
      current.stockQuantity === 0
        ? "Out of Stock"
        : current.stockQuantity <= current.reorderLevel
          ? "Low Stock"
          : "In Stock"
    onSave({
      ...current,
      availabilityStatus,
      displayName:
        current.displayName ||
        `${current.genericName} ${current.strength} ${current.dosageForm}`,
    })
  }

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={handleOpenChange}
      title={medicine ? "Edit Medicine" : "Add Medicine"}
      description="Maintain the medicine identity and pharmacy stock details."
      className="sm:max-w-[480px]"
    >
      <form onSubmit={submit} className="flex flex-col gap-4 py-2">
        <Tabs value={step} onValueChange={setStep}>
          <TabsList className="grid h-8 w-full grid-cols-2 rounded-md bg-muted p-1 dark:bg-[#1e1e1e]">
            <TabsTrigger value="identity" className="h-full rounded-sm text-xs">
              Medicine Identity
            </TabsTrigger>
            <TabsTrigger value="stock" className="h-full rounded-sm text-xs">
              Stock &amp; Compliance
            </TabsTrigger>
          </TabsList>
        </Tabs>
        {step === "identity" ? (
          <div className="flex flex-col gap-3">
            <Field label="Generic Name" htmlFor="inventory-generic">
              <Input
                id="inventory-generic"
                value={current.genericName}
                onChange={(event) => update("genericName", event.target.value)}
                placeholder="e.g. Paracetamol"
                className="!h-8 text-xs"
              />
            </Field>
            <Field label="Display Name" htmlFor="inventory-display">
              <Input
                id="inventory-display"
                value={current.displayName}
                onChange={(event) => update("displayName", event.target.value)}
                placeholder="e.g. Paracetamol 500 mg Tablet"
                className="!h-8 text-xs"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Strength" htmlFor="inventory-strength">
                <Input
                  id="inventory-strength"
                  value={current.strength}
                  onChange={(event) => update("strength", event.target.value)}
                  placeholder="500 mg"
                  className="!h-8 text-xs"
                />
              </Field>
              <Field label="Dosage Form" htmlFor="inventory-form">
                <Select
                  value={current.dosageForm}
                  onValueChange={(value) => update("dosageForm", value)}
                >
                  <SelectTrigger
                    id="inventory-form"
                    className="!h-8 w-full text-xs"
                  >
                    <SelectValue placeholder="Select form" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tablet" className="text-xs">
                      Tablet
                    </SelectItem>
                    <SelectItem value="Capsule" className="text-xs">
                      Capsule
                    </SelectItem>
                    <SelectItem value="Syrup" className="text-xs">
                      Syrup
                    </SelectItem>
                    <SelectItem value="Injection" className="text-xs">
                      Injection
                    </SelectItem>
                    <SelectItem value="Cream" className="text-xs">
                      Cream
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Route" htmlFor="inventory-route">
                <Select
                  value={current.route}
                  onValueChange={(value) => update("route", value)}
                >
                  <SelectTrigger
                    id="inventory-route"
                    className="!h-8 w-full text-xs"
                  >
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Oral" className="text-xs">
                      Oral
                    </SelectItem>
                    <SelectItem value="Topical" className="text-xs">
                      Topical
                    </SelectItem>
                    <SelectItem value="Subcutaneous" className="text-xs">
                      Subcutaneous
                    </SelectItem>
                    <SelectItem value="Inhalation" className="text-xs">
                      Inhalation
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Category" htmlFor="inventory-category">
                <Input
                  id="inventory-category"
                  value={current.category}
                  onChange={(event) => update("category", event.target.value)}
                  placeholder="e.g. Analgesic"
                  className="!h-8 text-xs"
                />
              </Field>
            </div>
            <Field label="Manufacturer" htmlFor="inventory-manufacturer">
              <Input
                id="inventory-manufacturer"
                value={current.manufacturer}
                onChange={(event) => update("manufacturer", event.target.value)}
                placeholder="Optional"
                className="!h-8 text-xs"
              />
            </Field>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Selling Price" htmlFor="inventory-price">
                <Input
                  id="inventory-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={current.sellingPrice}
                  onChange={(event) =>
                    update("sellingPrice", Number(event.target.value))
                  }
                  className="!h-8 text-xs"
                />
              </Field>
              <Field label="Unit of Sale" htmlFor="inventory-unit">
                <Input
                  id="inventory-unit"
                  value={current.unitOfSale}
                  onChange={(event) => update("unitOfSale", event.target.value)}
                  placeholder="Tablet"
                  className="!h-8 text-xs"
                />
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Stock" htmlFor="inventory-stock">
                <Input
                  id="inventory-stock"
                  type="number"
                  min="0"
                  value={current.stockQuantity}
                  onChange={(event) =>
                    update("stockQuantity", Number(event.target.value))
                  }
                  className="!h-8 text-xs"
                />
              </Field>
              <Field label="Reorder Level" htmlFor="inventory-reorder">
                <Input
                  id="inventory-reorder"
                  type="number"
                  min="0"
                  value={current.reorderLevel}
                  onChange={(event) =>
                    update("reorderLevel", Number(event.target.value))
                  }
                  className="!h-8 text-xs"
                />
              </Field>
              <Field label="Reserved" htmlFor="inventory-reserved">
                <Input
                  id="inventory-reserved"
                  type="number"
                  min="0"
                  value={current.reservedQuantity}
                  onChange={(event) =>
                    update("reservedQuantity", Number(event.target.value))
                  }
                  className="!h-8 text-xs"
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Batch Number" htmlFor="inventory-batch">
                <Input
                  id="inventory-batch"
                  value={current.batchNumber}
                  onChange={(event) =>
                    update("batchNumber", event.target.value)
                  }
                  placeholder="Optional"
                  className="!h-8 text-xs"
                />
              </Field>
              <Field label="Expiration Date" htmlFor="inventory-expiry">
                <Input
                  id="inventory-expiry"
                  type="date"
                  value={current.expirationDate}
                  onChange={(event) =>
                    update("expirationDate", event.target.value)
                  }
                  className="!h-8 text-xs"
                />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-xs">
              <Checkbox
                checked={current.prescriptionRequired}
                onCheckedChange={(checked) =>
                  update("prescriptionRequired", checked === true)
                }
                className="h-3.5 w-3.5"
              />
              Prescription required
            </label>
            <Field label="Description" htmlFor="inventory-description">
              <Textarea
                id="inventory-description"
                value={current.description}
                onChange={(event) => update("description", event.target.value)}
                placeholder="Optional product description"
                className="min-h-16 text-xs"
              />
            </Field>
          </div>
        )}
        <div className="flex items-center gap-2 border-t border-sidebar-border pt-4">
          <Button
            type="button"
            variant="outline"
            className="h-8 flex-1 text-xs"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          {step === "identity" ? (
            <Button
              type="button"
              className="h-8 flex-1 text-xs"
              onClick={() => setStep("stock")}
            >
              Continue
            </Button>
          ) : (
            <Button type="submit" className="h-8 flex-1 text-xs">
              <Check className="h-3.5 w-3.5" />
              Save Medicine
            </Button>
          )}
        </div>
      </form>
    </ResponsiveModal>
  )
}

function StockAdjustmentModal({
  medicine,
  onClose,
  onAdjust,
}: {
  medicine: Medicine | null
  onClose: () => void
  onAdjust: (
    id: string,
    stockQuantity: number,
    reservedQuantity: number
  ) => void
}) {
  const [stockQuantity, setStockQuantity] = useState(0)
  const [reservedQuantity, setReservedQuantity] = useState(0)

  useEffect(() => {
    if (medicine) {
      setStockQuantity(medicine.stockQuantity)
      setReservedQuantity(medicine.reservedQuantity)
    }
  }, [medicine])

  return (
    <ResponsiveModal
      open={!!medicine}
      onOpenChange={(open) => !open && onClose()}
      title="Adjust Stock"
      description="Update the available and reserved quantities for this medicine."
      className="sm:max-w-[425px]"
    >
      <div className="flex flex-col gap-4 py-2">
        <div className="flex flex-col gap-1">
          <h3 className="text-xs font-medium">{medicine?.displayName}</h3>
          <p className="text-[11px] text-muted-foreground">
            Adjust quantities using the controls below.
          </p>
        </div>
        <QuantityControl
          label="Available Stock"
          description="Units currently available for sale."
          value={stockQuantity}
          onChange={setStockQuantity}
        />
        <QuantityControl
          label="Reserved Quantity"
          description="Units held for prescriptions or pending orders."
          value={reservedQuantity}
          onChange={setReservedQuantity}
        />
        <div className="flex items-center gap-2 border-t border-sidebar-border pt-4">
          <Button
            variant="outline"
            className="h-8 flex-1 text-xs"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="h-8 flex-1 text-xs"
            onClick={() =>
              medicine && onAdjust(medicine.id, stockQuantity, reservedQuantity)
            }
          >
            Save Changes
          </Button>
        </div>
      </div>
    </ResponsiveModal>
  )
}

function QuantityControl({
  label,
  description,
  value,
  onChange,
}: {
  label: string
  description: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs font-medium">{label}</p>
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="flex h-8 shrink-0 items-center overflow-hidden rounded-md border border-sidebar-border bg-background dark:bg-[#0a0a0a]">
        <button
          type="button"
          className="flex h-full w-8 items-center justify-center text-muted-foreground transition-colors hover:bg-accent dark:hover:bg-white/5"
          onClick={() => onChange(Math.max(0, value - 1))}
          aria-label={`Decrease ${label}`}
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="flex h-full w-10 items-center justify-center border-x border-sidebar-border text-xs">
          {value}
        </span>
        <button
          type="button"
          className="flex h-full w-8 items-center justify-center text-muted-foreground transition-colors hover:bg-accent dark:hover:bg-white/5"
          onClick={() => onChange(value + 1)}
          aria-label={`Increase ${label}`}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

function createBlankMedicine(): Medicine {
  return {
    id: `med_${Date.now()}`,
    genericName: "",
    brandName: "",
    displayName: "",
    strength: "",
    dosageForm: "Tablet",
    route: "Oral",
    category: "",
    manufacturer: "",
    fdaRegistrationNumber: "",
    prescriptionRequired: false,
    packageType: "",
    packageQuantity: "",
    packageUnit: "",
    sellingPrice: 0,
    currency: "PHP",
    stockQuantity: 0,
    reservedQuantity: 0,
    unitOfSale: "Unit",
    batchNumber: "",
    expirationDate: "",
    reorderLevel: 0,
    status: "Active",
    availabilityStatus: "Out of Stock",
    description: "",
  }
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Label
        htmlFor={htmlFor}
        className="text-xs font-medium text-foreground dark:text-white"
      >
        {label}
      </Label>
      {children}
    </div>
  )
}
