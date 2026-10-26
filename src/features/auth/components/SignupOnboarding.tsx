import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { BrandLogo } from "@/components/BrandLogo"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { PhilippineAddressSelector } from "@/features/auth/components/PhilippineAddressSelector"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Role = "doctor" | "pharmacist"

function Field({
  label,
  placeholder,
  className = "",
  type = "text",
}: {
  label: string
  placeholder: string
  className?: string
  type?: string
}) {
  return (
    <div className={`flex min-w-0 flex-col gap-2 ${className}`}>
      <Label>{label}</Label>
      <Input type={type} placeholder={placeholder} className="h-8 text-sm" />
    </div>
  )
}

function DateField({ label }: { label: string }) {
  const [date, setDate] = useState<Date>()

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-8 w-full justify-between text-left text-sm font-normal"
          >
            {date ? date.toLocaleDateString("en-US") : "00/00/0000"}
            <span className="text-xs">⌄</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto border-[#3d3d3d] bg-[#0b0b0b] p-0"
          align="start"
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            className="bg-[#0b0b0b] text-white [--cell-size:--spacing(8)]"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export function SignupOnboarding() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const role: Role =
    params.get("role") === "pharmacist" ? "pharmacist" : "doctor"
  const [step, setStep] = useState<1 | 2>(1)
  const [declarationAccepted, setDeclarationAccepted] = useState(false)
  const [addressValid, setAddressValid] = useState(false)

  const isDoctor = role === "doctor"
  const title =
    step === 1
      ? "Step 1: Professional Identification"
      : isDoctor
        ? "Step 2: Clinic & Contact Practice"
        : "Step 2: Pharmacy Details & Location"

  return (
    <main className="flex min-h-svh w-full items-center justify-center bg-[#171717] px-6 py-12 text-white">
      <div className="flex w-full max-w-[581px] flex-col items-center">
        <BrandLogo className="mb-6" />

        <Card className="w-full rounded-[13px] border border-[#3a3a3a] bg-transparent px-6 py-6 text-white ring-0 sm:px-6">
          <header className="mb-6 text-center">
            <h1 className="mb-2 text-xl font-semibold tracking-tight text-[#f1f1f1]">
              {title}
            </h1>
            <p className="text-sm text-[#999999]">
              Let&apos;s create your healthcare provider account
            </p>
          </header>

          <div className="mb-6 flex gap-1.5">
            <div
              className={`h-2 flex-1 rounded-full ${step === 2 ? "bg-[#16c963]" : "bg-[#4a4a4a]"}`}
            />
            <div className="h-2 flex-1 rounded-full bg-[#4a4a4a]" />
          </div>

          {step === 1 ? (
            <div className="grid gap-4">
              <div className="grid grid-cols-[minmax(0,1fr)_154px] gap-7">
                <Field
                  label="Given Name"
                  placeholder={
                    isDoctor ? "Marc Lester E. Sulit" : "John Francis Villareal"
                  }
                />
                <Field
                  label="Suffix"
                  placeholder={isDoctor ? "e.g MD," : "e.g RPh,"}
                />
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_154px] gap-7">
                <Field label="PRC License No." placeholder="0123456" />
                <DateField label="PRC Expiration Date" />
              </div>
              <Field
                label={
                  isDoctor ? "PRT Number" : "FDA License to Operate (LTO) No"
                }
                placeholder={isDoctor ? "1234567A" : "CDRR-R5-DS-123456"}
              />
              <Button
                type="button"
                onClick={() => setStep(2)}
                className="h-8 w-full text-sm"
              >
                Proceed
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              <Field
                label={isDoctor ? "Hospital Name" : "Pharmacy Trade Name"}
                placeholder={
                  isDoctor
                    ? "Naga Imaging Center Cooperative (NICC) Doctors Hospital"
                    : "St. Jude Community Pharmacy"
                }
              />
              <PhilippineAddressSelector
                onChange={(address) =>
                  setAddressValid(
                    Boolean(
                      address.provinceCode &&
                      address.cityCode &&
                      address.barangayCode &&
                      address.streetAddress.trim()
                    )
                  )
                }
              />
              <Field
                label="Contact Number"
                placeholder="09193430640"
                type="tel"
              />
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={declarationAccepted}
                  onCheckedChange={(checked) =>
                    setDeclarationAccepted(checked === true)
                  }
                  className="mt-0.5 data-[state=checked]:!border-[#16c963] data-[state=checked]:!bg-[#16c963] data-[state=checked]:!text-white"
                />
                <span className="text-sm leading-5 text-[#eeeeee]">
                  {isDoctor ? "Physician" : "Pharmacist"} Declaration
                  <span className="mt-2 block text-sm leading-5 text-[#999999]">
                    I certify under penalty of law that I am a{" "}
                    {isDoctor
                      ? "duly licensed physician"
                      : "registered pharmacist"}{" "}
                    in the Philippines{" "}
                    {isDoctor
                      ? "and the credentials provided are accurate, active, and valid."
                      : "holding an active PRC license, and this dispensary operates under a valid FDA License to Operate."}
                  </span>
                </span>
              </div>
              <Button
                type="button"
                onClick={() => {
                  window.localStorage.setItem("baylan-role", role)
                  navigate(`/dashboard/prescriptions?role=${role}`)
                }}
                className="h-8 w-full text-sm"
              >
                Finish
              </Button>
            </div>
          )}
        </Card>

        <p className="mt-6 text-center text-[12px] leading-[17px] text-[#999999]">
          By clicking continue, you agree to
          <br />
          our{" "}
          <a href="#" className="underline underline-offset-2">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline underline-offset-2">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </main>
  )
}
