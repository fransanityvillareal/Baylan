import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Pill, Stethoscope } from "lucide-react"
import logo from "@/assets/Header.svg"

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

  const continueToSignIn = () => {
    if (selectedRole) {
      navigate(`/signin?role=${selectedRole}`)
    }
  }

  const continueToSignup = () => {
    if (selectedRole) {
      navigate(`/signup?role=${selectedRole}`)
    }
  }

  return (
    <main className="flex min-h-svh w-full items-center justify-center bg-[#171717] px-6 py-12 text-white">
      <div className="flex w-full max-w-[533px] flex-col items-center">
        <img src={logo} alt="Unite" className="mb-[54px] h-auto w-[155px]" />

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
                onClick={() => setSelectedRole(role.id)}
                className={`flex h-[326px] flex-col rounded-[14px] border bg-[#0d0d0d] p-6 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff3a3a] ${
                  isSelected
                    ? "border-[#ff3a3a]"
                    : "border-[#3b3b3b] hover:border-[#686868]"
                }`}
              >
                <div className="flex flex-1 items-center justify-center">
                  <img
                    src={role.image}
                    alt=""
                    className="h-[126px] w-auto object-contain"
                  />
                </div>
                <div>
                  <h2 className="mb-1 text-[19px] font-semibold text-[#e8e8e8]">
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

        <button
          type="button"
          disabled={!selectedRole}
          onClick={continueToSignIn}
          className="h-9 w-full rounded-[9px] bg-[#eeeeee] text-[14px] font-medium text-[#171717] transition-opacity hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
        </button>

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

        <p className="mt-[47px] text-center text-[12px] leading-[17px] text-[#999999]">
          By clicking continue, you agree to
          <br />
          our <a href="#" className="underline underline-offset-2">Terms of Service</a> and <a href="#" className="underline underline-offset-2">Privacy Policy</a>.
        </p>
      </div>
    </main>
  )
}
