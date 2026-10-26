import { useMemo, useState } from "react"
import { CalendarDays, CheckCircle2, CircleAlert, Download, Filter, MapPin, MoreVertical, Package, RefreshCw, Search, UserRound, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type OrderStatus = "Pending" | "Ready for Pickup" | "Completed" | "Cancelled"

const orders = [
  { id: "ORD-2026-1042", customer: "Angelo Melicio Agawa", product: "Birch Tree Fortified Milk", productId: "birch-tree-fortified-milk", barcode: "4800361420012", quantity: 2, status: "Ready for Pickup" as OrderStatus, date: "Jun 08, 2026 · 10:45 AM" },
  { id: "ORD-2026-1041", customer: "Daniel Cruz", product: "Amoxicillin 500 mg Capsule", productId: "amoxicillin-500", barcode: "4801234567890", quantity: 1, status: "Pending" as OrderStatus, date: "Jun 08, 2026 · 09:20 AM" },
  { id: "ORD-2026-1040", customer: "Beatrice Flores", product: "Insulin Glargine 50 MG Injection", productId: "insulin-glargine", barcode: "4809876543210", quantity: 1, status: "Completed" as OrderStatus, date: "Jun 07, 2026 · 03:15 PM" },
  { id: "ORD-2026-1039", customer: "Maria Santos", product: "Birch Tree Fortified Milk", productId: "birch-tree-fortified-milk", barcode: "4800361420012", quantity: 4, status: "Cancelled" as OrderStatus, date: "Jun 07, 2026 · 01:05 PM" },
  { id: "ORD-2026-1038", customer: "Jose Ramirez", product: "Amoxicillin 500 mg Capsule", productId: "amoxicillin-500", barcode: "4801234567890", quantity: 2, status: "Ready for Pickup" as OrderStatus, date: "Jun 06, 2026 · 04:40 PM" },
  { id: "ORD-2026-1037", customer: "Liza Fernandez", product: "Insulin Glargine 50 MG Injection", productId: "insulin-glargine", barcode: "4809876543210", quantity: 1, status: "Pending" as OrderStatus, date: "Jun 06, 2026 · 02:10 PM" },
  { id: "ORD-2026-1036", customer: "Carlo Mendoza", product: "Birch Tree Fortified Milk", productId: "birch-tree-fortified-milk", barcode: "4800361420012", quantity: 1, status: "Completed" as OrderStatus, date: "Jun 05, 2026 · 11:25 AM" },
  { id: "ORD-2026-1035", customer: "Nina Garcia", product: "Amoxicillin 500 mg Capsule", productId: "amoxicillin-500", barcode: "4801234567890", quantity: 3, status: "Completed" as OrderStatus, date: "Jun 05, 2026 · 09:50 AM" },
  { id: "ORD-2026-1034", customer: "Rafael Aquino", product: "Birch Tree Fortified Milk", productId: "birch-tree-fortified-milk", barcode: "4800361420012", quantity: 2, status: "Ready for Pickup" as OrderStatus, date: "Jun 04, 2026 · 03:30 PM" },
]

const statusStyles: Record<OrderStatus, string> = {
  Pending: "bg-amber-500 hover:bg-amber-500",
  "Ready for Pickup": "bg-blue-500 hover:bg-blue-500",
  Completed: "bg-emerald-500 hover:bg-emerald-500",
  Cancelled: "bg-red-500 hover:bg-red-500",
}

const orderStatuses: OrderStatus[] = ["Pending", "Ready for Pickup", "Completed", "Cancelled"]
const statusDotStyles: Record<OrderStatus, string> = {
  Pending: "bg-amber-500",
  "Ready for Pickup": "bg-blue-500",
  Completed: "bg-emerald-500",
  Cancelled: "bg-red-500",
}

export function OrdersPage() {
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<string[]>([])
  const [orderRows, setOrderRows] = useState(orders)
  const [selectedOrder, setSelectedOrder] = useState<(typeof orders)[number] | null>(null)
  const [page, setPage] = useState(1)
  const pageSize = 9
  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return orderRows
    return orderRows.filter((order) =>
      [order.id, order.customer, order.product, order.productId, order.barcode, order.status]
        .some((value) => value.toLowerCase().includes(normalizedQuery))
    )
  }, [orderRows, query])
  const pageCount = Math.max(1, Math.ceil(filteredOrders.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pageOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const updateStatus = (orderId: string, status: OrderStatus) => {
    setOrderRows((current) => current.map((order) => order.id === orderId ? { ...order, status } : order))
  }

  const toggleAll = (checked: boolean) => setSelected(checked ? pageOrders.map((order) => order.id) : [])
  const toggleOne = (id: string, checked: boolean) => setSelected((current) => checked ? [...current, id] : current.filter((item) => item !== id))

  return (
    <div className="flex h-full w-full min-w-0 flex-row overflow-hidden bg-background text-foreground dark:bg-black">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-10 flex flex-col gap-4 bg-background p-4 pb-4 pl-3 dark:bg-black">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Orders</h1>
            <p className="mt-1 text-xs text-muted-foreground">Track customer orders and product fulfillment status.</p>
          </div>
          <div className="flex w-full gap-2 md:w-auto">
            <Button variant="outline" className="hidden h-8 gap-2 border-sidebar-border px-2 text-xs md:flex"><Download className="size-3.5" />Export</Button>
            <Button variant="outline" className="h-8 gap-2 border-sidebar-border px-2 text-xs"><RefreshCw className="size-3.5" />Refresh</Button>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-[280px]">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter orders..." className="h-8 border-sidebar-border bg-background pl-8 text-xs dark:bg-black" />
          </div>
          <Button variant="outline" className="h-8 gap-2 border-dashed border-sidebar-border px-2 text-xs"><Filter className="size-3.5" />Status</Button>
        </div>
        </div>

        <div className="flex flex-col gap-4 p-4 pb-24 pl-3 md:pt-0 md:pb-4">
        <div className="overflow-x-auto rounded-md border border-sidebar-border bg-background dark:bg-black">
          <div className="min-w-[820px]">
            <Table>
              <TableHeader className="bg-card dark:bg-[#111]">
                <TableRow className="border-sidebar-border hover:bg-transparent">
                  <TableHead className="w-12 pl-4 text-center"><Checkbox checked={pageOrders.length > 0 && pageOrders.every((order) => selected.includes(order.id))} onCheckedChange={(checked) => toggleAll(Boolean(checked))} aria-label="Select all orders" /></TableHead>
                  <TableHead className="text-xs font-medium">Order ID</TableHead>
                  <TableHead className="text-xs font-medium">Customer</TableHead>
                  <TableHead className="text-xs font-medium">Quantity</TableHead>
                  <TableHead className="text-xs font-medium">Order Date</TableHead>
                  <TableHead className="text-xs font-medium">Product Status</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageOrders.map((order) => (
                  <TableRow key={order.id} className="border-sidebar-border transition-colors hover:bg-accent dark:hover:bg-white/5">
                    <TableCell className="p-2 pl-4"><Checkbox checked={selected.includes(order.id)} onCheckedChange={(checked) => toggleOne(order.id, Boolean(checked))} aria-label={`Select ${order.id}`} /></TableCell>
                    <TableCell className="whitespace-nowrap p-2 text-xs font-medium">{order.id}</TableCell>
                    <TableCell className="whitespace-nowrap p-2 text-xs">{order.customer}</TableCell>
                    <TableCell className="p-2 text-xs">{order.quantity}</TableCell>
                    <TableCell className="whitespace-nowrap p-2 text-xs text-muted-foreground">{order.date}</TableCell>
                    <TableCell className="p-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-auto p-0 hover:bg-transparent" aria-label={`Change status for ${order.id}`}>
                            <Badge className={`w-fit gap-1 whitespace-nowrap px-1.5 py-0.5 text-[10px] text-white ${statusStyles[order.status]}`}>
                              {order.status === "Completed" ? <CheckCircle2 className="size-3" /> : order.status === "Cancelled" ? <CircleAlert className="size-3" /> : null}
                              {order.status}
                            </Badge>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-[170px] rounded-xl border-border shadow-md">
                          <div className="px-2 py-1.5 text-[10px] font-medium text-muted-foreground">Update status</div>
                          {orderStatuses.map((status) => (
                            <DropdownMenuItem key={status} disabled={status === order.status} onClick={() => updateStatus(order.id, status)} className="cursor-pointer rounded-md text-xs">
                              {status}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="p-2 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-7 text-muted-foreground hover:text-foreground" aria-label={`Actions for ${order.id}`}>
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px] rounded-xl border-border shadow-md">
                          <DropdownMenuItem className="cursor-pointer rounded-md text-xs" onClick={() => setSelectedOrder(order)}>View order</DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="cursor-pointer rounded-md text-xs">Update status</DropdownMenuSubTrigger>
                            <DropdownMenuSubContent className="w-[170px] rounded-xl border-border shadow-md">
                              {orderStatuses.map((status) => (
                                <DropdownMenuItem key={status} disabled={status === order.status} onClick={() => updateStatus(order.id, status)} className="cursor-pointer rounded-md text-xs">
                                  <span className={`size-2 rounded-full ${statusDotStyles[status]}`} />
                                  {status}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer rounded-md text-xs text-destructive focus:text-destructive">Cancel order</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredOrders.length === 0 && <div className="p-8 text-center text-xs text-muted-foreground">No orders match your search.</div>}
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <span>{filteredOrders.length} order{filteredOrders.length === 1 ? "" : "s"}</span>
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" aria-disabled={currentPage === 1} className={currentPage === 1 ? "pointer-events-none opacity-50" : ""} onClick={(event) => { event.preventDefault(); setPage((value) => Math.max(1, value - 1)) }} />
              </PaginationItem>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink href="#" isActive={currentPage === pageNumber} onClick={(event) => { event.preventDefault(); setPage(pageNumber) }}>{pageNumber}</PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext href="#" aria-disabled={currentPage === pageCount} className={currentPage === pageCount ? "pointer-events-none opacity-50" : ""} onClick={(event) => { event.preventDefault(); setPage((value) => Math.min(pageCount, value + 1)) }} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
        </div>
      </div>
      {selectedOrder && <OrderSidepeek order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </div>
  )
}

function OrderSidepeek({ order, onClose }: { order: (typeof orders)[number]; onClose: () => void }) {
  return (
    <aside className="z-40 flex h-full w-[min(390px,42vw)] min-w-[320px] shrink-0 flex-col border-l border-sidebar-border bg-background text-foreground dark:bg-[#0a0a0a]">
      <div className="flex shrink-0 items-start justify-between border-b border-sidebar-border p-4">
        <div className="flex flex-col gap-2"><h2 className="text-sm font-medium">{order.id}</h2><StatusBadge status={order.status} /></div>
        <Button variant="ghost" size="icon" className="size-6 text-muted-foreground hover:text-foreground" onClick={onClose} aria-label="Close order details"><X className="size-4" /></Button>
      </div>
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto text-xs">
        <section className="space-y-3 border-b border-border p-4 dark:border-white/10"><div className="flex items-center gap-2"><h3 className="text-xs font-medium">Order Summary</h3><Package className="size-3.5 text-muted-foreground" /></div><InfoRow icon={<UserRound />} label="Customer" value={order.customer} /><InfoRow icon={<CalendarDays />} label="Order Date" value={order.date} /><InfoRow icon={<Package />} label="Quantity" value={`${order.quantity} unit${order.quantity === 1 ? "" : "s"}`} /></section>
        <section className="space-y-3 border-b border-border p-4 dark:border-white/10"><div className="flex items-center gap-2"><h3 className="text-xs font-medium">Product Details</h3><Package className="size-3.5 text-muted-foreground" /></div><InfoRow label="Product" value={order.product} /><InfoRow label="Product ID" value={order.productId} /><InfoRow label="Barcode" value={order.barcode} /></section>
        <section className="space-y-3 p-4"><div className="flex items-center gap-2"><h3 className="text-xs font-medium">Fulfillment</h3><MapPin className="size-3.5 text-muted-foreground" /></div><InfoRow label="Pickup Location" value="St. Gabriel General Hospital Pharmacy" /><InfoRow label="Contact" value="0969 867 8654" /><InfoRow label="Status" value={order.status} /></section>
      </div>
      <div className="shrink-0 border-t border-sidebar-border p-4 pb-8 md:pb-4"><Button variant="secondary" className="h-8 w-full border border-sidebar-border bg-muted text-xs font-medium dark:bg-[#1e1e1e]" onClick={onClose}>Close Details</Button></div>
    </aside>
  )
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return <Badge className={`w-fit gap-1 whitespace-nowrap px-1.5 py-0.5 text-[10px] text-white ${statusStyles[status]}`}>{status === "Completed" ? <CheckCircle2 className="size-3" /> : status === "Cancelled" ? <CircleAlert className="size-3" /> : null}{status}</Badge>
}

function InfoRow({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return <div className="flex items-center gap-3"><span className="flex w-[112px] shrink-0 items-center gap-2 text-muted-foreground [&_svg]:size-3.5">{icon}<span className="truncate">{label}</span></span><span className="min-w-0 flex-1 truncate">{value}</span></div>
}
