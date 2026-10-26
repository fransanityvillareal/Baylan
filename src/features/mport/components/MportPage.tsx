import { useEffect, useMemo, useRef, useState } from "react"
import * as mapboxgl from "mapbox-gl/esm"
import "mapbox-gl/dist/mapbox-gl.css"
import {
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Clock3,
  MapPin,
  Minus,
  Pill,
  Plus,
  Search,
  ShoppingBag,
} from "lucide-react"
import { BrandLogo } from "@/components/BrandLogo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CheckoutModal } from "./CheckoutModal"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Medicine = {
  id: string
  name: string
  genericName: string
  strength: string
  form: string
  category: string
  price: number
  description: string
  color: string
  image: string
}

type Pharmacy = {
  id: string
  name: string
  distance: string
  eta: string
  address: string
  available: string[]
  longitude: number
  latitude: number
}

const medicines: Medicine[] = [
  {
    id: "biogesic-500",
    name: "Biogesic",
    genericName: "Paracetamol",
    strength: "500 mg",
    form: "Tablet · 20s",
    category: "Pain Relief",
    price: 68,
    description: "For temporary relief of fever and minor aches.",
    color: "bg-primary/10 text-primary",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=640&q=80",
  },
  {
    id: "amoxicillin-500",
    name: "Amoxicillin",
    genericName: "Amoxicillin",
    strength: "500 mg",
    form: "Capsule · 10s",
    category: "Antibiotics",
    price: 124,
    description: "Prescription medicine. Pharmacist verification required.",
    color: "bg-primary/10 text-primary",
    image:
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=640&q=80",
  },
  {
    id: "cetirizine-10",
    name: "Cetirizine",
    genericName: "Cetirizine HCl",
    strength: "10 mg",
    form: "Tablet · 10s",
    category: "Allergy",
    price: 52,
    description: "Once-daily relief from common allergy symptoms.",
    color:
      "bg-primary/10 text-primary",
    image:
      "https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=640&q=80",
  },
  {
    id: "insulin-glargine",
    name: "Insulin Glargine",
    genericName: "Insulin Glargine",
    strength: "100 units/mL",
    form: "Pre-filled pen",
    category: "Diabetes Care",
    price: 1240,
    description: "Long-acting insulin. Keep refrigerated after pickup.",
    color:
      "bg-primary/10 text-primary",
    image:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=640&q=80",
  },
]

const pharmacies: Pharmacy[] = [
  {
    id: "bmc-pharmacy",
    name: "St. Gabriel General Hospital Pharmacy",
    distance: "0.8 km",
    eta: "Ready in 15–20 min",
    address: "Concepcion Pequeña, Naga City",
    available: ["biogesic-500", "amoxicillin-500", "cetirizine-10"],
    longitude: 123.1948,
    latitude: 13.6218,
  },
  {
    id: "southstar-naga",
    name: "Southstar Drug · Naga",
    distance: "1.4 km",
    eta: "Ready in 20–30 min",
    address: "Magsaysay Avenue, Naga City",
    available: ["biogesic-500", "cetirizine-10", "insulin-glargine"],
    longitude: 123.1867,
    latitude: 13.6265,
  },
  {
    id: "generika-centro",
    name: "Generika Drugstore · Centro",
    distance: "2.1 km",
    eta: "Ready in 30–40 min",
    address: "Panganiban Drive, Naga City",
    available: ["biogesic-500", "amoxicillin-500"],
    longitude: 123.1915,
    latitude: 13.6192,
  },
]

const categories = [
  "All Medicines",
  "Pain Relief",
  "Antibiotics",
  "Allergy",
  "Diabetes Care",
]

export function MportPage() {
  const [category, setCategory] = useState("All Medicines")
  const [query, setQuery] = useState("")
  const [cart, setCart] = useState<Record<string, number>>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [productView, setProductView] = useState<
    "collapsed" | "preview" | "maximized"
  >("preview")
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])

  useEffect(() => {
    if (!mapContainerRef.current) return

    const map = new mapboxgl.Map({
      accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [123.1905, 13.6225],
      zoom: 13.4,
      attributionControl: true,
      dragPan: true,
      scrollZoom: true,
      touchZoomRotate: true,
      doubleClickZoom: true,
      dragRotate: false,
    })

    map.addControl(new mapboxgl.NavigationControl(), "bottom-right")
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      "bottom-right"
    )
    mapRef.current = map
    map.on("load", () => {
      map.resize()
      requestAnimationFrame(() => map.resize())
    })
    const resizeObserver = new ResizeObserver(() => map.resize())
    resizeObserver.observe(mapContainerRef.current)

    return () => {
      resizeObserver.disconnect()
      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current = []
      map.remove()
      mapRef.current = null
    }
  }, [])

  const filteredMedicines = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return medicines.filter((medicine) => {
      const matchesCategory =
        category === "All Medicines" || medicine.category === category
      const matchesQuery =
        !normalizedQuery ||
        [medicine.name, medicine.genericName, medicine.category]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      return matchesCategory && matchesQuery
    })
  }, [category, query])

  const cartItems = medicines.filter((medicine) => cart[medicine.id])
  const cartCount = Object.values(cart).reduce(
    (sum, quantity) => sum + quantity,
    0
  )
  const cartTotal = cartItems.reduce(
    (sum, medicine) => sum + medicine.price * cart[medicine.id],
    0
  )
  const availablePharmacies = useMemo(
    () =>
      pharmacies.filter((pharmacy) =>
        Object.keys(cart).every((medicineId) =>
          pharmacy.available.includes(medicineId)
        )
      ),
    [cart]
  )

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = pharmacies.map((pharmacy) => {
      const isAvailable =
        cartCount === 0 ||
        availablePharmacies.some((item) => item.id === pharmacy.id)
      const markerElement = document.createElement("button")
      markerElement.type = "button"
      markerElement.setAttribute(
        "aria-label",
        `${pharmacy.name}, ${isAvailable ? "in stock" : "not available"}`
      )
      markerElement.style.display = "flex"
      markerElement.style.flexDirection = "column"
      markerElement.style.alignItems = "center"
      markerElement.style.border = "0"
      markerElement.style.background = "transparent"
      markerElement.style.cursor = isAvailable ? "pointer" : "default"
      markerElement.style.opacity = isAvailable ? "1" : "0.35"

      const pin = document.createElement("span")
      pin.style.width = "24px"
      pin.style.height = "24px"
      pin.style.borderRadius = "50% 50% 50% 0"
      pin.style.transform = "rotate(-45deg)"
      pin.style.background = isAvailable ? "#ff3767" : "#64748b"
      pin.style.border = "2px solid white"
      pin.style.boxShadow = "0 2px 6px rgb(0 0 0 / 0.25)"
      markerElement.appendChild(pin)

      if (isAvailable) {
        const label = document.createElement("span")
        label.textContent = "In stock"
        label.style.marginTop = "-2px"
        label.style.padding = "2px 6px"
        label.style.borderRadius = "999px"
        label.style.background = "white"
        label.style.color = "#ff3767"
        label.style.font = "600 10px Inter, sans-serif"
        label.style.whiteSpace = "nowrap"
        label.style.boxShadow = "0 1px 4px rgb(0 0 0 / 0.2)"
        markerElement.appendChild(label)
      }

      markerElement.addEventListener("click", () => {
        map.flyTo({ center: [pharmacy.longitude, pharmacy.latitude], zoom: 15 })
      })

      return new mapboxgl.Marker({ element: markerElement, anchor: "bottom" })
        .setLngLat([pharmacy.longitude, pharmacy.latitude])
        .addTo(map)
    })

    return () => {
      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current = []
    }
  }, [availablePharmacies, cartCount])

  const updateCart = (medicineId: string, change: number) => {
    setCart((current) => {
      const nextQuantity = Math.max(0, (current[medicineId] ?? 0) + change)
      const next = { ...current }
      if (nextQuantity === 0) delete next[medicineId]
      else next[medicineId] = nextQuantity
      return next
    })
  }

  return (
    <div className="min-h-svh bg-primary/5 text-foreground">
      <header className="sticky top-0 z-50 h-14 border-b border-primary/20 bg-primary text-primary-foreground shadow-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 md:px-6">
          <BrandLogo
            iconClassName="h-8 w-8 rounded-[6px]"
            textClassName="h-8 w-auto"
          />
          <div className="hidden items-center gap-2 border-l border-white/25 pl-4 text-xs text-primary-foreground sm:flex">
            <MapPin className="h-3.5 w-3.5" />
            <span className="font-medium">New address</span>
            <span className="text-primary-foreground/70">Naga City</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-1.5 rounded-md bg-white/15 px-2.5 py-1.5 text-xs text-primary-foreground md:flex">
              <Clock3 className="h-3.5 w-3.5" />
              <span>Time Standard</span>
            </div>
            <a href="/signin" className="hidden sm:block">
              <Button
                variant="outline"
                className="h-8 border-white/30 bg-transparent px-4 text-xs text-primary-foreground hover:bg-white/15 hover:text-primary-foreground"
              >
                Log in
              </Button>
            </a>
            <a href="/signup" className="hidden sm:block">
              <Button className="h-8 px-4 text-xs">Sign up</Button>
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:px-6 md:py-8 lg:relative lg:block lg:h-[calc(100svh-3.5rem)] lg:min-h-0 lg:max-w-none lg:overflow-hidden lg:p-0">
        <div className="relative grid items-start gap-6 lg:absolute lg:inset-0 lg:block">
          <section
            className={`flex min-w-0 flex-col gap-3 overflow-hidden rounded-lg border border-border bg-background p-4 text-foreground shadow-lg lg:absolute lg:right-[392px] lg:bottom-4 lg:left-4 lg:z-30 ${productView === "collapsed" ? "h-16" : productView === "maximized" ? "h-[75svh] lg:top-4 lg:h-auto" : "h-[min(360px,50svh)]"}`}
          >
            <div className="flex shrink-0 items-center justify-between gap-4">
              <h2 className="text-base font-semibold tracking-tight text-foreground">
                Popular products
              </h2>
              <div className="flex items-center gap-1">
                {productView !== "collapsed" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={
                      productView === "maximized"
                        ? "Restore product panel"
                        : "Maximize product panel"
                    }
                    onClick={() =>
                      setProductView(
                        productView === "maximized" ? "preview" : "maximized"
                      )
                    }
                  >
                    {productView === "maximized" ? (
                      <Minimize2 />
                    ) : (
                      <Maximize2 />
                    )}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="h-8 text-xs"
                  aria-expanded={productView !== "collapsed"}
                  aria-controls="medicine-browser"
                  onClick={() =>
                    setProductView(
                      productView === "collapsed" ? "preview" : "collapsed"
                    )
                  }
                >
                  {productView === "collapsed" ? (
                    <ChevronUp />
                  ) : (
                    <ChevronDown />
                  )}
                  {productView === "collapsed"
                    ? "Show products"
                    : "Hide products"}
                </Button>
              </div>
            </div>
            {productView !== "collapsed" && (
              <div
                id="medicine-browser"
                className="flex min-h-0 flex-1 flex-col gap-3"
              >
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <div className="relative w-full shrink-0 sm:w-52">
                    <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      aria-label="Search medicines"
                      placeholder="Search medicines..."
                      className="h-8 pl-8 text-xs"
                    />
                  </div>
                  <Tabs
                    value={category}
                    onValueChange={setCategory}
                    className="max-w-full min-w-0"
                  >
                    <div className="max-w-full overflow-x-auto">
                      <TabsList className="h-8 w-max">
                        {categories.map((item) => (
                          <TabsTrigger
                            key={item}
                            value={item}
                            className="px-2.5 text-[10px]"
                          >
                            {item}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </div>
                  </Tabs>
                </div>
                <div className="grid min-h-0 min-w-0 flex-1 auto-rows-max grid-cols-[repeat(auto-fill,minmax(160px,1fr))] content-start gap-4 overflow-x-hidden overflow-y-auto pb-1">
                  {filteredMedicines.map((medicine) => (
                    <Card
                      key={medicine.id}
                      className="relative w-full min-w-0 gap-2 border-0 bg-transparent py-0 shadow-none ring-0"
                    >
                      <CardHeader className="gap-2 p-0 pb-2">
                        <div className="relative flex h-28 w-full items-center justify-center overflow-hidden rounded-md bg-muted">
                          <img
                            src={medicine.image}
                            alt="Illustrative pharmacy photograph"
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/5" />
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute right-2 bottom-2 size-8 rounded-md border-border bg-background shadow-sm hover:bg-muted"
                            onClick={() => updateCart(medicine.id, 1)}
                            aria-label={`Add ${medicine.name} to cart`}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-1 pt-1">
                          <div className="text-sm font-medium text-foreground">
                            {medicine.name}
                          </div>
                          <div className="line-clamp-2 text-xs text-muted-foreground">
                            {medicine.genericName} · {medicine.strength} ·{" "}
                            {medicine.form}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-2 p-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-foreground">
                            ₱{medicine.price.toFixed(2)}
                          </span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {cart[medicine.id]
                            ? `${cart[medicine.id]} in cart`
                            : "Illustrative image"}
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                  {filteredMedicines.length === 0 && (
                    <div className="flex min-h-48 w-full shrink-0 items-center justify-center rounded-lg border border-dashed border-border bg-background text-xs text-muted-foreground">
                      No medicines match your search.
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          <div className="relative flex min-h-0 flex-col gap-4 lg:absolute lg:inset-0 lg:block">
            <Card className="flex min-h-0 flex-col gap-0 rounded-lg border border-border bg-background py-0 text-foreground shadow-lg lg:absolute lg:top-4 lg:right-4 lg:bottom-4 lg:z-40 lg:w-[360px] lg:overflow-hidden">
              <CardHeader className="shrink-0 border-b border-border p-4">
                <CardTitle className="flex items-center justify-between text-base">
                  Your cart
                  <Badge variant="secondary">
                    {cartCount} {cartCount === 1 ? "item" : "items"}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {cartCount
                    ? "Review your items before choosing a pharmacy."
                    : "Start adding items to your cart"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex min-h-0 flex-1 flex-col p-0">
                <div className="min-h-0 flex-1 overflow-y-auto p-4">
                  {cartItems.length === 0 && (
                    <div className="flex h-full min-h-40 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
                      <ShoppingBag className="size-7" />
                      <p className="text-sm font-medium text-foreground">
                        Your cart is empty
                      </p>
                      <p className="text-xs">
                        Add a medicine below to check nearby availability.
                      </p>
                    </div>
                  )}
                  {cartItems.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {cartItems.map((medicine) => (
                        <div
                          key={medicine.id}
                          className="flex items-center gap-2 border-b border-border py-3"
                        >
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${medicine.color}`}
                          >
                            <Pill className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium">
                              {medicine.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              ₱{medicine.price.toFixed(2)} × {cart[medicine.id]}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon-xs"
                              className="border-border"
                              onClick={() => updateCart(medicine.id, -1)}
                              aria-label={`Remove one ${medicine.name}`}
                            >
                              <Minus />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon-xs"
                              className="border-border"
                              onClick={() => updateCart(medicine.id, 1)}
                              aria-label={`Add one ${medicine.name}`}
                            >
                              <Plus />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-3 border-t border-border p-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₱{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span>
                      Total{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        (incl. fees and tax)
                      </span>
                    </span>
                    <span>₱{cartTotal.toFixed(2)}</span>
                  </div>
                  <Button
                    className="h-8 w-full text-xs"
                    onClick={() => setCartOpen(true)}
                  >
                    Go to checkout
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="relative min-h-[70svh] overflow-hidden bg-transparent lg:fixed lg:inset-0 lg:top-[3.5rem] lg:right-0 lg:bottom-0 lg:left-0 lg:z-0 lg:min-h-0">
              <div
                ref={mapContainerRef}
                className="pointer-events-auto absolute inset-0 h-full min-h-full w-full"
              />
            </div>
          </div>
        </div>
      </main>

      {cartOpen && (
        <CheckoutModal
          open={cartOpen}
          onOpenChange={setCartOpen}
          items={cartItems.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: cart[item.id],
          }))}
          pharmacies={availablePharmacies}
          onComplete={() => setCart({})}
        />
      )}
    </div>
  )
}
