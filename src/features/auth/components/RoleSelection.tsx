import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Moon, Pill, Stethoscope, Sun } from "lucide-react"
import { BrandLogo } from "@/components/BrandLogo"
import { useTheme } from "@/components/theme-provider"

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
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  const continueToSignup = () => {
    if (selectedRole) {
      window.localStorage.setItem("baylan-role", selectedRole)
      navigate(`/signup?role=${selectedRole}`)
    }
  }

  return (
    <main className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-background px-6 py-6 text-foreground">
      <button
        type="button"
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="absolute right-6 top-6 rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </button>

      <div className="flex w-full max-w-[500px] flex-col items-center">
        <BrandLogo className="mb-6" />

        <div className="mb-6 text-center">
          <h1 className="mb-1 text-[21px] font-semibold tracking-[-0.02em] text-foreground">
            Welcome!
          </h1>
          <p className="text-[14px] text-muted-foreground">
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
                  setSelectedRole(role.id)
                  window.localStorage.setItem("baylan-role", role.id)
                  navigate(`/signin?role=${role.id}`)
                }}
                className={`flex h-[260px] flex-col rounded-xl border bg-card p-5 text-left transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
                  isSelected
                    ? "border-primary"
                    : "border-border hover:border-primary/60"
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
                  <h2 className="mb-1 text-lg font-semibold text-card-foreground">
                    {role.name}
                  </h2>
                  <p className="flex items-center gap-2 text-[14px] text-muted-foreground">
                    <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
                    {role.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        <p className="mt-3 text-[14px] text-muted-foreground">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={continueToSignup}
            disabled={!selectedRole}
            className="underline underline-offset-2 transition-colors hover:text-primary disabled:cursor-not-allowed"
          >
            Sign up
          </button>
        </p>

        <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
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
