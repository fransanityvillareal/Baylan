import { useState } from "react"
import { CircleCheck } from "lucide-react"
import { ResponsiveModal } from "@/components/ui/responsive-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: { id: string; name: string; price: number; quantity: number }[]
  pharmacies: { id: string; name: string; address: string }[]
  onComplete: () => void
}

export function CheckoutModal({
  open,
  onOpenChange,
  items,
  pharmacies,
  onComplete,
}: Props) {
  const [step, setStep] = useState<"details" | "review" | "confirmed">(
    "details"
  )
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [pharmacyId, setPharmacyId] = useState(pharmacies[0]?.id ?? "")
  const [receipt, setReceipt] = useState<{
    reference: string
    pharmacy: string
    total: number
  } | null>(null)
  const pharmacy = pharmacies.find((item) => item.id === pharmacyId)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title={step === "confirmed" ? "Demo order confirmed" : "Checkout"}
      description={
        step === "confirmed"
          ? "No payment was collected or order sent to a pharmacy."
          : "Arrange pickup and pay at the pharmacy. This is a demo checkout."
      }
    >
      {step === "confirmed" && receipt ? (
        <div className="space-y-4 text-sm">
          <CircleCheck className="size-8 text-emerald-500" />
          <p>
            Thank you{name.trim() ? `, ${name.trim()}` : ""}. Your demo order is
            ready to review.
          </p>
          <dl className="space-y-2 text-xs">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Reference</dt>
              <dd>{receipt.reference}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Pickup</dt>
              <dd className="text-right">{receipt.pharmacy}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Estimated total</dt>
              <dd>₱{receipt.total.toFixed(2)}</dd>
            </div>
          </dl>
          <Button className="h-8 w-full" onClick={() => onOpenChange(false)}>
            Continue browsing
          </Button>
        </div>
      ) : (
        <form
          noValidate
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            if (step === "details") {
              setStep("review")
              return
            }
            setReceipt({
              reference: `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
              pharmacy: pharmacy?.name ?? "Not selected",
              total,
            })
            setStep("confirmed")
            onComplete()
          }}
        >
          <p className="text-xs text-muted-foreground">
            {step === "details"
              ? "Step 1 of 2 · Pickup details"
              : "Step 2 of 2 · Review order"}
          </p>
          {step === "details" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="checkout-name">Full name</Label>
                <Input
                  id="checkout-name"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkout-phone">Mobile number</Label>
                <Input
                  id="checkout-phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </div>
              <fieldset className="space-y-2">
                <legend className="mb-2 text-xs font-medium">
                  Pickup pharmacy
                </legend>
                <div className="max-h-40 divide-y divide-border overflow-y-auto">
                  {pharmacies.map((location) => (
                    <label
                      key={location.id}
                      className="flex cursor-pointer items-start gap-2 py-3 text-xs"
                    >
                      <input
                        type="radio"
                        name="pickup-pharmacy"
                        checked={pharmacyId === location.id}
                        onChange={() => setPharmacyId(location.id)}
                        className="mt-0.5"
                      />
                      <span>
                        <span className="block font-medium">
                          {location.name}
                        </span>
                        <span className="text-muted-foreground">
                          {location.address}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
                {!pharmacies.length && (
                  <p role="status" className="text-xs text-destructive">
                    No pharmacy has every item in your cart. You can still
                    continue this demo without selecting one.
                  </p>
                )}
              </fieldset>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div>
                <p className="font-medium">
                  {name.trim() || "Name not provided"} ·{" "}
                  {phone.trim() || "Phone not provided"}
                </p>
                <p className="mt-1 text-muted-foreground">
                  Pickup pharmacy: {pharmacy?.name ?? "Not selected"}
                </p>
              </div>
              <ul className="max-h-48 divide-y divide-border overflow-y-auto">
                {items.map((item) => (
                  <li key={item.id} className="flex justify-between gap-4 py-3">
                    <span>
                      {item.quantity} × {item.name}
                    </span>
                    <span className="shrink-0">
                      ₱{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground">
                Payment: pay at pickup. Prescription medicines require
                pharmacist verification.
              </p>
              <div className="flex justify-between text-sm font-semibold">
                <span>Estimated total</span>
                <span>₱{total.toFixed(2)}</span>
              </div>
            </div>
          )}
          <div className="flex gap-2 border-t border-border pt-4">
            <Button
              type="button"
              variant="secondary"
              className="h-8 flex-1"
              onClick={() =>
                step === "review" ? setStep("details") : onOpenChange(false)
              }
            >
              {step === "review" ? "Back" : "Cancel"}
            </Button>
            <Button type="submit" className="h-8 flex-1">
              {step === "details" ? "Review order" : "Confirm demo order"}
            </Button>
          </div>
        </form>
      )}
    </ResponsiveModal>
  )
}
