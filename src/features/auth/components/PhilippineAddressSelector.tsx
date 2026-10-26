import { useState } from "react"
import { Check, ChevronsUpDown, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { usePhilippineAddress, type PhilippineAddress } from "@/features/auth/hooks/usePhilippineAddress"
import type { PsgcLocation } from "@/features/auth/api/psgcApi"

function LocationPicker({ label, placeholder, value, items, disabled, loading, onSelect }: { label: string; placeholder: string; value: string; items: PsgcLocation[]; disabled?: boolean; loading?: boolean; onSelect: (item: PsgcLocation) => void }) {
  const [open, setOpen] = useState(false)
  return <div className="flex min-w-0 flex-col gap-2"><Label>{label}</Label><Popover open={open} onOpenChange={setOpen}><PopoverTrigger asChild><Button type="button" variant="outline" disabled={disabled} className="h-8 w-full min-w-0 justify-between overflow-hidden px-3 text-left text-sm font-normal"><span className="min-w-0 truncate">{value || placeholder}</span>{loading ? <Loader2 className="ml-2 size-4 shrink-0 animate-spin" /> : <ChevronsUpDown className="ml-2 size-4 shrink-0 text-muted-foreground" />}</Button></PopoverTrigger><PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0"><Command><CommandInput placeholder={`Search ${label.toLowerCase()}...`} /><CommandList><CommandEmpty>No locations found.</CommandEmpty>{items.map((item) => <CommandItem key={item.code} value={item.name} onSelect={() => { onSelect(item); setOpen(false) }}>{item.name}<Check className={cn("ml-auto size-4 text-[#16c963]", value === item.name ? "opacity-100" : "opacity-0")} /></CommandItem>)}</CommandList></Command></PopoverContent></Popover></div>
}

export function PhilippineAddressSelector({ initialValue, onChange, error: externalError }: { initialValue?: Partial<PhilippineAddress>; onChange?: (address: PhilippineAddress) => void; error?: string }) {
  const state = usePhilippineAddress(initialValue)
  const notify = (next: PhilippineAddress) => onChange?.(next)
  const setProvince = (item: PsgcLocation) => { state.selectProvince(item); notify({ ...state.address, provinceCode: item.code, provinceName: item.name, cityCode: "", cityName: "", barangayCode: "", barangayName: "", streetAddress: "" }) }
  const setCity = (item: PsgcLocation) => { state.selectCity(item); notify({ ...state.address, cityCode: item.code, cityName: item.name, barangayCode: "", barangayName: "", streetAddress: "" }) }
  const setBarangay = (item: PsgcLocation) => { state.selectBarangay(item); notify({ ...state.address, barangayCode: item.code, barangayName: item.name, streetAddress: "" }) }
  const setStreet = (value: string) => { state.update("streetAddress", value); notify({ ...state.address, streetAddress: value }) }
  return <div className="grid gap-4"><LocationPicker label="Province" placeholder="Select province" value={state.address.provinceName} items={state.provinces} loading={state.loading.provinces} onSelect={setProvince} /><div className="grid min-w-0 gap-4 sm:grid-cols-2"><LocationPicker label="City / Municipality" placeholder="Select city or municipality" value={state.address.cityName} items={state.cities} disabled={!state.address.provinceCode} loading={state.loading.cities} onSelect={setCity} /><LocationPicker label="Barangay" placeholder="Select barangay" value={state.address.barangayName} items={state.barangays} disabled={!state.address.cityCode} loading={state.loading.barangays} onSelect={setBarangay} /><div className="flex min-w-0 flex-col gap-2 sm:col-span-2"><Label htmlFor="street-address">Street Address</Label><Input id="street-address" value={state.address.streetAddress} onChange={(event) => setStreet(event.target.value)} placeholder="House number, street, subdivision" className="h-8 min-w-0 text-sm" disabled={!state.address.barangayCode} /></div></div>{(externalError || state.error) && <div className="flex items-center justify-between text-sm text-red-400" role="alert"><span>{externalError || state.error}</span><Button type="button" variant="ghost" size="sm" onClick={state.retry}><RefreshCw className="mr-1 size-3" />Retry</Button></div>}</div>
}
