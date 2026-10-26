import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { Camera, CheckCircle2, ScanQrCode } from "lucide-react"
import { ResponsiveModal } from "@/components/ui/responsive-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ScanPrescriptionModal({ children }: { children: ReactNode }) {
  const [code, setCode] = useState("")
  const [scannedCode, setScannedCode] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [scanError, setScanError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const frameRef = useRef<number | null>(null)
  const closeTimerRef = useRef<number | null>(null)

  const stopCamera = () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    frameRef.current = null
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setIsScanning(false)
  }

  useEffect(() => () => {
    stopCamera()
    if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current)
  }, [])

  const startCamera = async () => {
    setScannedCode(null)
    setScanError(null)

    if (!("BarcodeDetector" in window)) {
      setScanError("QR scanning is not supported in this browser.")
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      })
      streamRef.current = stream
      if (!videoRef.current) return
      videoRef.current.srcObject = stream
      await videoRef.current.play()
      setIsScanning(true)

      const Detector = (window as typeof window & {
        BarcodeDetector: new (options?: { formats?: string[] }) => {
          detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue?: string }>>
        }
      }).BarcodeDetector
      const detector = new Detector({ formats: ["qr_code"] })

      const scanFrame = async () => {
        if (!videoRef.current || !streamRef.current) return
        try {
          const result = await detector.detect(videoRef.current)
          const value = result[0]?.rawValue?.trim()
          if (value) {
            setCode(value)
            setScannedCode(value)
            stopCamera()
            closeTimerRef.current = window.setTimeout(() => setOpen(false), 900)
            return
          }
        } catch {
          setScanError("Could not read the QR code. Try holding it steady.")
        }
        frameRef.current = requestAnimationFrame(() => void scanFrame())
      }
      frameRef.current = requestAnimationFrame(() => void scanFrame())
    } catch {
      setScanError("Camera access was denied or is unavailable.")
      stopCamera()
    }
  }

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) {
          stopCamera()
          if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current)
        }
      }}
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
          {!scannedCode && (
            <div className="relative h-40 w-full max-w-[280px] overflow-hidden rounded-md bg-muted/50">
              <video
                ref={videoRef}
                muted
                playsInline
                className={`h-full w-full object-cover ${isScanning ? "" : "hidden"}`}
                aria-label="QR code camera preview"
              />
              {!isScanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Camera className="h-8 w-8" />
                  <span className="text-[11px]">Camera preview</span>
                </div>
              )}
            </div>
          )}
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {scannedCode
                ? "Prescription detected"
                : "Position the QR code in the frame"}
            </p>
            <p className="text-xs text-muted-foreground">
              {scannedCode
                ? "The prescription QR code was read successfully."
                : scanError || "Position the prescription QR code in the camera preview."}
            </p>
          </div>
          {!scannedCode && (
            <Button
              type="button"
              variant="outline"
              className="h-8 gap-2 text-xs"
              onClick={() => void startCamera()}
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
