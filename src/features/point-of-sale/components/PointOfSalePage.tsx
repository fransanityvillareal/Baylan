import { useEffect, useMemo, useRef, useState } from "react"
import { Barcode, CheckCircle2, CircleAlert, Minus, MoreVertical, Plus, Search, ShoppingBasket, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ResponsiveModal } from "@/components/ui/responsive-modal"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Product = {
  id: string
  name: string
  strength: string
  form: string
  price: number
  stock: number
  reorderAt: number
  reserved: number
  batch: string
  expiry: string
  status: "in-stock" | "low-stock" | "out-of-stock"
  image?: string
  barcode: string
  attributes?: {
    genericName: string
    brandName: string
    dosageForm: string
    route: string
    category: string
    activeIngredients: string
    manufacturer: string
    packageType: string
    packageQuantity: string
    packageUnit: string
    barcode: string
    description: string
    storage: string
    prescriptionRequired: boolean
  }
}

const products: Product[] = [
  { id: "birch-tree-fortified-milk", name: "Birch Tree Fortified Milk", strength: "1.5 kg", form: "Powdered Milk · Oral", price: 548, stock: 245, reorderAt: 50, reserved: 18, batch: "BTM-2603-A", expiry: "2027-03-31", status: "in-stock", barcode: "4800361420012", image: "/product-1.png", attributes: { genericName: "Fortified powdered milk", brandName: "Birch Tree", dosageForm: "Powder", route: "Oral", category: "Nutritional supplement", activeIngredients: "Milk solids, vitamins and minerals", manufacturer: "Yashiya International Inc.", packageType: "Pouch", packageQuantity: "1", packageUnit: "1.5 kg pouch", barcode: "4800361420012", description: "Fortified powdered milk drink mix for everyday family nutrition.", storage: "Store in a cool, dry place. Keep sealed after opening.", prescriptionRequired: false } },
  { id: "amoxicillin-500", name: "Amoxicillin 500 mg Capsule", strength: "500 mg", form: "Capsule · Oral", price: 12, stock: 24, reorderAt: 30, reserved: 8, batch: "AMX-2512-B", expiry: "2026-12-15", status: "low-stock", barcode: "4801234567890" },
  { id: "insulin-glargine", name: "Insulin Glargine 50 MG Injection", strength: "50 MG", form: "Injection · Subcutaneous", price: 840, stock: 0, reorderAt: 10, reserved: 0, batch: "INS-2508-C", expiry: "2026-08-30", status: "out-of-stock", barcode: "4809876543210" },
]

function QuantityControl({ label, description, value, onChange }: { label: string; description: string; value: number; onChange: (value: number) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0"><p className="text-sm font-medium">{label}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p></div>
      <div className="flex h-8 shrink-0 items-center overflow-hidden rounded-md border border-sidebar-border bg-background dark:bg-[#0a0a0a]">
        <button type="button" className="flex h-full w-8 items-center justify-center text-muted-foreground transition-colors hover:bg-accent dark:hover:bg-white/5" onClick={() => onChange(Math.max(1, value - 1))} aria-label={`Decrease ${label}`}><Minus className="size-3.5" /></button>
        <input type="number" min={1} value={value} onChange={(event) => onChange(Math.max(1, Number(event.target.value) || 1))} className="h-full w-10 appearance-none border-x border-sidebar-border bg-transparent text-center text-xs outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" aria-label={`${label} value`} />
        <button type="button" className="flex h-full w-8 items-center justify-center text-muted-foreground transition-colors hover:bg-accent dark:hover:bg-white/5" onClick={() => onChange(value + 1)} aria-label={`Increase ${label}`}><Plus className="size-3.5" /></button>
      </div>
    </div>
  )
}

function ProductDetailsDrawer({ product, onClose, onAdd }: { product: Product | null; onClose: () => void; onAdd: (product: Product, quantity: number) => void }) {
  const [quantity, setQuantity] = useState(1)

  return (
    <Dialog open={Boolean(product)} onOpenChange={(open) => { if (!open) onClose() }}>
      {product && (
        <DialogContent showCloseButton={false} className="flex max-h-[85vh] max-w-[500px] flex-col gap-0 overflow-hidden bg-background p-0 text-foreground dark:bg-[#0a0a0a]">
          <div className="flex shrink-0 items-start justify-between border-b border-sidebar-border p-4">
            <div className="flex flex-col gap-2"><h2 className="text-sm font-medium">{product.name}</h2><Badge className="w-fit gap-1 rounded-sm border border-[#22C55E]/20 bg-[#22C55E] px-1.5 py-0.5 text-[10px] text-white"><CheckCircle2 className="size-3" /> Product found</Badge></div>
            <Button variant="ghost" size="icon" className="size-6 text-muted-foreground" onClick={onClose} aria-label="Close product details"><X className="size-4" /></Button>
          </div>
          <div className="min-w-0 flex-1 overflow-y-auto text-xs">
            <section className="border-b border-border p-4 dark:border-white/10"><img src={product.image ?? "/product-1.png"} alt={product.name} className="h-44 w-full rounded-lg object-contain" /></section>
            <section className="space-y-3 border-b border-border p-4 dark:border-white/10"><h3 className="text-sm font-medium">Product Summary</h3><p className="leading-relaxed text-muted-foreground">Birch Tree Fortified Milk is a powdered milk drink mix suitable for everyday family nutrition.</p></section>
            <section className="border-b border-border p-4 dark:border-white/10"><QuantityControl label="Quantity" description="Units currently available for sale." value={quantity} onChange={(value) => setQuantity(Math.min(product.stock || 1, value))} /></section>
            <section className="space-y-4 border-b border-border p-4 dark:border-white/10"><h3 className="text-sm font-medium">Medicine Attributes</h3><div className="grid grid-cols-[140px_1fr] gap-y-4"><span className="text-muted-foreground">Generic Name</span><span className="font-medium">{product.attributes?.genericName}</span><span className="text-muted-foreground">Brand Name</span><span className="font-medium">{product.attributes?.brandName}</span><span className="text-muted-foreground">Dosage Form</span><span className="font-medium">{product.attributes?.dosageForm}</span><span className="text-muted-foreground">Route</span><span className="font-medium">{product.attributes?.route}</span><span className="text-muted-foreground">Category</span><span className="font-medium">{product.attributes?.category}</span><span className="text-muted-foreground">Active Ingredients</span><span className="font-medium">{product.attributes?.activeIngredients}</span><span className="text-muted-foreground">Manufacturer</span><span className="font-medium">{product.attributes?.manufacturer}</span><span className="text-muted-foreground">Packaging</span><span className="font-medium">{product.attributes?.packageType} · {product.attributes?.packageQuantity} {product.attributes?.packageUnit}</span><span className="text-muted-foreground">Barcode</span><span className="font-medium">{product.attributes?.barcode}</span><span className="text-muted-foreground">Prescription</span><span className="font-medium">{product.attributes?.prescriptionRequired ? "Required" : "Not required"}</span></div></section>
            <section className="space-y-4 border-b border-border p-4 dark:border-white/10"><h3 className="text-sm font-medium">Inventory Attributes</h3><div className="grid grid-cols-[140px_1fr] gap-y-4"><span className="text-muted-foreground">Form / Strength</span><span className="font-medium">{product.form} · {product.strength}</span><span className="text-muted-foreground">Price</span><span className="font-medium">PHP {product.price.toFixed(2)} per unit</span><span className="text-muted-foreground">Available Stock</span><span className="font-medium">{product.stock} units</span><span className="text-muted-foreground">Reserved</span><span className="font-medium">{product.reserved} units</span><span className="text-muted-foreground">Batch / Expiry</span><span className="font-medium">{product.batch}<br />expires {product.expiry}</span></div></section>
          </div>
          <div className="flex shrink-0 items-center border-t border-sidebar-border p-4">
            <Button type="button" className="h-9 w-full gap-2 text-sm" disabled={product.stock === 0} onClick={() => onAdd(product, quantity)}><ShoppingBasket className="size-4" />Add to basket</Button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  )
}

function BarcodeScannerModal({ onDetected }: { onDetected: (barcode: string) => void }) {
  const [open, setOpen] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [manualBarcode, setManualBarcode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const frameRef = useRef<number | null>(null)

  const stopCamera = () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    frameRef.current = null
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setIsScanning(false)
  }

  useEffect(() => () => stopCamera(), [])

  const startCamera = async () => {
    setResult(null)
    setError(null)
    if (!("BarcodeDetector" in window)) {
      setError("Barcode scanning is not supported in this browser.")
      return
    }
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false })
      if (!videoRef.current) return
      videoRef.current.srcObject = streamRef.current
      await videoRef.current.play()
      setIsScanning(true)
      const Detector = (window as typeof window & {
        BarcodeDetector: new (options?: { formats?: string[] }) => { detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue?: string }>> }
      }).BarcodeDetector
      const detector = new Detector({ formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "code_39", "itf"] })
      const scanFrame = async () => {
        if (!videoRef.current || !streamRef.current) return
        try {
          const detected = await detector.detect(videoRef.current)
          const value = detected[0]?.rawValue?.trim()
          if (value) {
            setResult(value)
            stopCamera()
            window.setTimeout(() => { setOpen(false); onDetected(value) }, 900)
            return
          }
        } catch {
          setError("Could not read the barcode. Try holding it steady.")
        }
        frameRef.current = requestAnimationFrame(() => void scanFrame())
      }
      frameRef.current = requestAnimationFrame(() => void scanFrame())
    } catch {
      setError("Camera access was denied or is unavailable.")
      stopCamera()
    }
  }

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={(nextOpen) => { setOpen(nextOpen); if (!nextOpen) stopCamera() }}
      title="Scan Barcode"
      description="Scan a medicine barcode to find it in inventory."
      className="sm:max-w-[425px]"
      trigger={<Button type="button" variant="outline" className="h-8 shrink-0 gap-2 px-2 text-xs"><Barcode className="size-3.5" /><span className="hidden sm:inline">Scan Barcode</span></Button>}
    >
      <div className="flex flex-col gap-4 py-2">
        {result ? (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-500" /><p className="text-sm font-medium">Product detected</p></div>
            <p className="mt-2 text-xs text-muted-foreground">Barcode: {result}</p>
            <p className="mt-1 text-sm font-medium">Medicine found in inventory</p>
          </div>
        ) : (
          <>
            <div className="relative h-32 overflow-hidden rounded-lg border border-dashed border-sidebar-border bg-muted/20">
              <video ref={videoRef} muted playsInline className={`h-full w-full object-cover ${isScanning ? "" : "hidden"}`} aria-label="Barcode camera preview" />
              {isScanning && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="relative h-16 w-[85%] rounded-md border-2 border-white/90 shadow-[0_0_0_999px_rgba(0,0,0,0.28)]">
                    <div className="absolute inset-x-2 top-1/2 h-px bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.9)]" />
                  </div>
                </div>
              )}
              {!isScanning && <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground"><Barcode className="size-8" /><p className="text-xs">Camera barcode preview</p></div>}
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            {isScanning && <p className="text-center text-[11px] text-muted-foreground">Align the barcode inside the frame.</p>}
            <Button type="button" variant="outline" className="h-8 gap-2 text-xs" onClick={() => void startCamera()}><Barcode className="size-3.5" />Start Camera</Button>
          </>
        )}
        <div className="flex flex-col gap-2">
          <Label htmlFor="pos-barcode" className="text-xs font-medium">Or enter barcode</Label>
          <div className="flex gap-2"><Input id="pos-barcode" value={manualBarcode} onChange={(event) => setManualBarcode(event.target.value)} placeholder="Scan or type a barcode" className="h-8 text-xs" /><Button type="button" className="h-8 px-3 text-xs" disabled={!manualBarcode.trim()} onClick={() => { setResult(manualBarcode.trim()); window.setTimeout(() => { setOpen(false); onDetected(manualBarcode.trim()) }, 900) }}>Find</Button></div>
        </div>
      </div>
    </ResponsiveModal>
  )
}

export function PointOfSalePage() {
  const [query, setQuery] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [basket, setBasket] = useState<Record<string, number>>({})
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const filteredProducts = useMemo(
    () => products.filter((product) =>
      `${product.name} ${product.strength}`.toLowerCase().includes(query.toLowerCase())
    ),
    [query]
  )

  const addToBasket = (product: Product) => {
    const quantity = Math.max(1, Math.min(product.stock, quantities[product.id] ?? 1))
    setBasket((current) => ({ ...current, [product.id]: quantity }))
  }

  return (
    <div className="flex min-h-full flex-col gap-4 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Point of Sale</h1>
          <p className="text-xs text-muted-foreground">Create a sale and dispense medicines from inventory.</p>
        </div>
      </div>

      <section className="flex min-w-0 flex-col gap-4">
          <div className="mb-4 flex w-full items-center justify-between gap-2">
            <div className="relative w-full md:w-auto">
                <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search medicines..." className="h-8 w-full border-sidebar-border bg-background pl-7 text-xs dark:bg-black sm:w-[250px]" aria-label="Search medicines" />
            </div>
            <BarcodeScannerModal onDetected={() => setSelectedProduct(products[0])} />
          </div>
          <div className="overflow-x-auto rounded-md border border-sidebar-border bg-background dark:bg-black">
            <div className="min-w-[1320px]">
              <Table>
              <TableHeader className="bg-card dark:bg-[#111]">
                <TableRow className="border-sidebar-border hover:bg-transparent">
                  <TableHead className="w-10 px-2"><Checkbox aria-label="Select all medicines" /></TableHead>
                  <TableHead className="px-2 text-xs font-medium">Medicine</TableHead>
                  <TableHead className="px-2 text-xs font-medium">Form / Strength</TableHead>
                  <TableHead className="px-2 text-xs font-medium">Price</TableHead>
                  <TableHead className="px-2 text-xs font-medium">Stock</TableHead>
                  <TableHead className="px-2 text-xs font-medium">Batch / Expiry</TableHead>
                  <TableHead className="px-2 text-xs font-medium">Barcode</TableHead>
                  <TableHead className="px-2 text-xs font-medium">Quantity</TableHead>
                  <TableHead className="min-w-[120px] px-2 text-xs font-medium">Availability</TableHead>
                  <TableHead className="w-28 px-2 text-right text-xs font-medium">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className="border-sidebar-border">
                    <TableCell className="p-2"><Checkbox aria-label={`Select ${product.name}`} /></TableCell>
                    <TableCell className="p-2 whitespace-nowrap"><p className="text-xs font-medium">{product.name}</p><p className="text-[11px] text-muted-foreground">{product.name.split(" ")[0]}{product.id === "amoxicillin-500" || product.id === "insulin-glargine" ? " · Rx required" : ""}</p></TableCell>
                    <TableCell className="p-2 whitespace-nowrap"><p className="text-xs">{product.form.split(" · ")[0]} · {product.strength}</p><p className="text-[11px] text-muted-foreground">{product.form.split(" · ")[1]}</p></TableCell>
                    <TableCell className="p-2 whitespace-nowrap"><p className="text-xs">PHP {product.price.toFixed(2)}</p><p className="text-[11px] text-muted-foreground">per {product.form.split(" · ")[0].toLowerCase()}</p></TableCell>
                    <TableCell className="p-2 text-xs whitespace-nowrap">{product.stock}</TableCell>
                    <TableCell className="p-2 whitespace-nowrap"><p className="text-xs">{product.batch}</p><p className="text-[11px] text-muted-foreground">expires {product.expiry}</p></TableCell>
                    <TableCell className="p-2 text-xs whitespace-nowrap text-muted-foreground">{product.barcode}</TableCell>
                    <TableCell className="p-2"><Input type="number" min={1} max={product.stock || 1} value={quantities[product.id] ?? 1} onChange={(event) => setQuantities((current) => ({ ...current, [product.id]: Number(event.target.value) }))} className="h-7 w-16 text-xs" aria-label={`Quantity for ${product.name}`} disabled={product.stock === 0} /></TableCell>
                    <TableCell className="p-2">
                      <Badge className={product.status === "in-stock" ? "w-fit gap-1 whitespace-nowrap bg-emerald-500 px-1.5 py-0.5 text-[10px] text-white hover:bg-emerald-500" : product.status === "low-stock" ? "w-fit gap-1 whitespace-nowrap bg-amber-500 px-1.5 py-0.5 text-[10px] text-white hover:bg-amber-500" : "w-fit gap-1 whitespace-nowrap bg-red-500 px-1.5 py-0.5 text-[10px] text-white hover:bg-red-500"}>
                        {product.status === "in-stock" ? <CheckCircle2 className="size-3" /> : <CircleAlert className="size-3" />}
                        {product.status === "in-stock" ? "In Stock" : product.status === "low-stock" ? "Low Stock" : "Out of Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-2 text-right">
                      <div className="flex items-center justify-end gap-1"><Button type="button" variant={basket[product.id] ? "secondary" : "outline"} className="h-7 gap-1 px-2 text-[10px]" disabled={product.stock === 0} onClick={() => addToBasket(product)}><ShoppingBasket className="size-3" />{basket[product.id] ? `${basket[product.id]} added` : "Add"}</Button><Button type="button" size="icon" variant="ghost" className="size-7" aria-label={`More actions for ${product.name}`}><MoreVertical className="size-4" /></Button></div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
            </div>
          </div>
        </section>
      <ProductDetailsDrawer product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={(product, quantity) => { setQuantities((current) => ({ ...current, [product.id]: quantity })); setBasket((current) => ({ ...current, [product.id]: quantity })); setSelectedProduct(null) }} />
    </div>
  )
}
