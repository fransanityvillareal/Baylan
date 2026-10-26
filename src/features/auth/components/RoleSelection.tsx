import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Pill, Stethoscope } from "lucide-react"
import { BrandLogo } from "@/components/BrandLogo"

type Role = "doctor" | "pharmacist"

const roles = [
  {
    id: "doctor" as const,
    name: "Doctor",
    description: "Clinical Prescribing",
    image: "/doctor.png",
    icon: Stethoscope,
  },
  {
    id: "pharmacist" as const,
    name: "Pharmacist",
    description: "Dispensing",
    image: "/pharmacy.png",
    icon: Pill,
  },
]

export function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const navigate = useNavigate()

  const continueToSignup = () => {
    if (selectedRole) {
      window.localStorage.setItem("baylan-role", selectedRole)
      navigate(`/signup?role=${selectedRole}`)
    }
  }

  return (
    <main className="flex min-h-svh w-full items-center justify-center overflow-hidden bg-[#171717] px-6 py-6 text-white">
      <div className="flex w-full max-w-[500px] flex-col items-center">
        <BrandLogo className="mb-6" />

        <div className="mb-6 text-center">
          <h1 className="mb-1 text-[21px] font-semibold tracking-[-0.02em] text-white">
            Welcome!
          </h1>
          <p className="text-[14px] text-[#999999]">
            Select your professional role to continue
          </p>
        </div>

        <div className="mb-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          {roles.map((role) => {
            const Icon = role.icon
            const isSelected = selectedRole === role.id

            return (
              <button
                key={role.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  window.localStorage.setItem("baylan-role", role.id)
                  navigate(`/signin?role=${role.id}`)
                }}
                className={`flex h-[260px] flex-col rounded-xl border bg-[#0d0d0d] p-5 text-left transition-colors focus-visible:ring-2 focus-visible:ring-[#ff3a3a] focus-visible:outline-none ${
                  isSelected
                    ? "border-[#ff3a3a]"
                    : "border-[#3b3b3b] hover:border-[#686868]"
                }`}
              >
                <div className="flex flex-1 items-center justify-center">
                  <img
                    src={role.image}
                    alt=""
                    className="h-24 w-auto object-contain"
                  />
                </div>
                <div>
                  <h2 className="mb-1 text-lg font-semibold text-[#e8e8e8]">
                    {role.name}
                  </h2>
                  <p className="flex items-center gap-2 text-[14px] text-[#999999]">
                    <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
                    {role.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        <p className="mt-3 text-[14px] text-[#999999]">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={continueToSignup}
            disabled={!selectedRole}
            className="underline underline-offset-2 transition-colors hover:text-white disabled:cursor-not-allowed"
          >
            Sign up
          </button>
        </p>

        <p className="mt-6 text-center text-xs leading-relaxed text-[#999999]">
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
