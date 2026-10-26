import { useState } from "react"
import type { ReactNode } from "react"
import { Camera, CheckCircle2, ScanQrCode } from "lucide-react"
import { ResponsiveModal } from "@/components/ui/responsive-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ScanPrescriptionModal({ children }: { children: ReactNode }) {
  const [code, setCode] = useState("")
  const [scannedCode, setScannedCode] = useState<string | null>(null)

  return (
    <ResponsiveModal
      trigger={children}
      title="Scan QR Code"
      description="Scan a prescription QR code to quickly retrieve its details."
      className="sm:max-w-[425px]"
    >
      <div className="flex flex-col gap-5 py-2">
        <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-sidebar-border bg-muted/20 px-6 text-center">
          {scannedCode ? (
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          ) : (
            <ScanQrCode className="h-8 w-8 text-muted-foreground" />
          )}
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {scannedCode
                ? "QR code found"
                : "Position the QR code in the frame"}
            </p>
            <p className="text-xs text-muted-foreground">
              {scannedCode
                ? `${scannedCode} is ready to open.`
                : "Camera scanning will connect to the prescription record."}
            </p>
          </div>
          {!scannedCode && (
            <Button
              type="button"
              variant="outline"
              className="h-8 gap-2 text-xs"
            >
              <Camera className="h-3.5 w-3.5" />
              Start Camera
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="prescription-qr-code" className="text-xs font-medium">
            Or enter prescription code
          </Label>
          <div className="flex gap-2">
            <Input
              id="prescription-qr-code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="e.g. RX-2026-0849"
              className="h-8 text-xs"
            />
            <Button
              type="button"
              className="h-8 shrink-0 px-3 text-xs"
              disabled={!code.trim()}
              onClick={() => setScannedCode(code.trim())}
            >
              Find
            </Button>
          </div>
        </div>
      </div>
    </ResponsiveModal>
  )
}
