import * as React from "react"
import { Plus, Trash2 } from "lucide-react"
import { ResponsiveModal } from "@/components/ui/responsive-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Medication = {
  id: number
  genericName: string
  stockDose: string
  quantity: string
  dosage: string
}

const emptyMedication = (id: number): Medication => ({
  id,
  genericName: "",
  stockDose: "",
  quantity: "",
  dosage: "",
})

export function CreatePrescriptionModal({
  children,
}: {
  children: React.ReactNode
}) {
  const [medications, setMedications] = React.useState<Medication[]>([
    emptyMedication(1),
  ])
  const [activeStep, setActiveStep] = React.useState("patient")

  const updateMedication = (
    id: number,
    field: keyof Omit<Medication, "id">,
    value: string
  ) => {
    setMedications((current) =>
      current.map((medication) =>
        medication.id === id ? { ...medication, [field]: value } : medication
      )
    )
  }

  const addMedication = () => {
    setMedications((current) => [
      ...current,
      emptyMedication(Math.max(...current.map((item) => item.id), 0) + 1),
    ])
  }

  const removeMedication = (id: number) => {
    setMedications((current) =>
      current.length === 1
        ? current
        : current.filter((medication) => medication.id !== id)
    )
  }

  return (
    <ResponsiveModal
      trigger={children}
      title="Create Prescription"
      description="Add the patient, encounter, and medications for this prescription."
      className="sm:max-w-[425px]"
    >
      <form
        className="flex flex-col gap-4 py-2"
        onSubmit={(event) => event.preventDefault()}
      >
        <Tabs value={activeStep} onValueChange={setActiveStep}>
          <TabsList className="grid h-9 w-full grid-cols-3 gap-1 rounded-md bg-muted p-1 dark:bg-[#1e1e1e]">
            <TabsTrigger
              value="patient"
              className="h-full rounded-sm border border-transparent px-2 py-1 text-xs font-medium text-muted-foreground transition-all hover:text-foreground data-[state=active]:!border-border data-[state=active]:!bg-background data-[state=active]:text-foreground dark:text-white/70 dark:hover:text-foreground dark:data-[state=active]:!border-[#333] dark:data-[state=active]:!bg-black dark:data-[state=active]:text-white"
            >
              Patient &amp; Encounter
            </TabsTrigger>
            <TabsTrigger
              value="medications"
              className="h-full rounded-sm border border-transparent px-2 py-1 text-xs font-medium text-muted-foreground transition-all hover:text-foreground data-[state=active]:!border-border data-[state=active]:!bg-background data-[state=active]:text-foreground dark:text-white/70 dark:hover:text-foreground dark:data-[state=active]:!border-[#333] dark:data-[state=active]:!bg-black dark:data-[state=active]:text-white"
            >
              Medications
            </TabsTrigger>
            <TabsTrigger
              value="location"
              className="h-full rounded-sm border border-transparent px-2 py-1 text-xs font-medium text-muted-foreground transition-all hover:text-foreground data-[state=active]:!border-border data-[state=active]:!bg-background data-[state=active]:text-foreground dark:text-white/70 dark:hover:text-foreground dark:data-[state=active]:!border-[#333] dark:data-[state=active]:!bg-black dark:data-[state=active]:text-white"
            >
              Location
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {activeStep === "patient" && (
          <div className="flex flex-col gap-4">
            <section className="flex flex-col gap-3">
              <h3 className="text-xs font-medium text-foreground dark:text-white">
                Patient Information
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field
                    label="Patient Name"
                    htmlFor="prescription-patient-name"
                  >
                    <Input
                      id="prescription-patient-name"
                      placeholder="Enter patient name"
                      className="!h-8 w-full text-xs"
                    />
                  </Field>
                </div>
                <Field label="Age" htmlFor="prescription-patient-age">
                  <Input
                    id="prescription-patient-age"
                    inputMode="numeric"
                    placeholder="Age"
                    className="!h-8 w-full text-xs"
                  />
                </Field>
                <Field label="Sex" htmlFor="prescription-patient-sex">
                  <Select>
                    <SelectTrigger
                      id="prescription-patient-sex"
                      className="!h-8 w-full text-xs"
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male" className="text-xs">
                        Male
                      </SelectItem>
                      <SelectItem value="female" className="text-xs">
                        Female
                      </SelectItem>
                      <SelectItem value="other" className="text-xs">
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field label="Patient Health Record" htmlFor="prescription-hrn">
                <Input
                  id="prescription-hrn"
                  placeholder="Enter health record number"
                  className="!h-8 text-xs"
                />
              </Field>
            </section>

            <section className="flex flex-col gap-3">
              <h3 className="text-xs font-medium text-foreground dark:text-white">
                Clinical Encounter
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Encounter Type"
                  htmlFor="prescription-encounter-type"
                >
                  <Select>
                    <SelectTrigger
                      id="prescription-encounter-type"
                      className="!h-8 w-full text-xs"
                    >
                      <SelectValue placeholder="Select encounter type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inpatient" className="text-xs">
                        In-patient
                      </SelectItem>
                      <SelectItem value="outpatient" className="text-xs">
                        Out-patient
                      </SelectItem>
                      <SelectItem value="emergency" className="text-xs">
                        Emergency
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field
                  label="Encounter Date"
                  htmlFor="prescription-encounter-date"
                >
                  <Input
                    id="prescription-encounter-date"
                    type="date"
                    defaultValue="2026-10-13"
                    className="!h-8 text-xs"
                  />
                </Field>
              </div>
              <Field
                label="Clinical Notes"
                htmlFor="prescription-clinical-notes"
              >
                <Textarea
                  id="prescription-clinical-notes"
                  placeholder="Add the indication or treatment notes"
                  className="min-h-16 resize-none text-xs"
                />
              </Field>
            </section>
          </div>
        )}

        {activeStep === "medications" && (
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-medium text-foreground dark:text-white">
                  Prescribed Items
                </h3>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Add each medication, dose, quantity, and administration
                  instruction.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-8 shrink-0 gap-1.5 px-2 text-xs"
                onClick={addMedication}
              >
                <Plus className="h-3.5 w-3.5" />
                Add Item
              </Button>
            </div>
            <div className="flex flex-col gap-3">
              {medications.map((medication, index) => (
                <div
                  key={medication.id}
                  className="border-t border-sidebar-border pt-3 first:border-t-0 first:pt-0"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-muted-foreground">
                      Medication {index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => removeMedication(medication.id)}
                      aria-label={`Remove medication ${index + 1}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_120px_72px]">
                    <Field
                      label="Generic Name"
                      htmlFor={`medication-${medication.id}-name`}
                    >
                      <Input
                        id={`medication-${medication.id}-name`}
                        value={medication.genericName}
                        onChange={(event) =>
                          updateMedication(
                            medication.id,
                            "genericName",
                            event.target.value
                          )
                        }
                        placeholder="e.g. Insulin Glargine"
                        className="!h-8 text-xs"
                      />
                    </Field>
                    <Field
                      label="Stock Dose"
                      htmlFor={`medication-${medication.id}-dose`}
                    >
                      <Input
                        id={`medication-${medication.id}-dose`}
                        value={medication.stockDose}
                        onChange={(event) =>
                          updateMedication(
                            medication.id,
                            "stockDose",
                            event.target.value
                          )
                        }
                        placeholder="50 MG"
                        className="!h-8 text-xs"
                      />
                    </Field>
                    <Field
                      label="Qty"
                      htmlFor={`medication-${medication.id}-quantity`}
                    >
                      <Input
                        id={`medication-${medication.id}-quantity`}
                        type="number"
                        min="1"
                        value={medication.quantity}
                        onChange={(event) =>
                          updateMedication(
                            medication.id,
                            "quantity",
                            event.target.value
                          )
                        }
                        placeholder="1"
                        className="!h-8 text-xs"
                      />
                    </Field>
                  </div>
                  <div className="mt-3">
                    <Field
                      label="Dosage Instructions"
                      htmlFor={`medication-${medication.id}-instructions`}
                    >
                      <Input
                        id={`medication-${medication.id}-instructions`}
                        value={medication.dosage}
                        onChange={(event) =>
                          updateMedication(
                            medication.id,
                            "dosage",
                            event.target.value
                          )
                        }
                        placeholder="e.g. Once a day for 2 days"
                        className="!h-8 text-xs"
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeStep === "location" && (
          <section className="flex flex-col gap-3">
            <h3 className="text-xs font-medium text-foreground dark:text-white">
              Hospital Location
            </h3>
            <p className="text-[10px] text-muted-foreground">
              Institution details are filled from your healthcare provider
              profile.
            </p>
            <Field label="Ward / Room" htmlFor="prescription-ward-room">
              <Input
                id="prescription-ward-room"
                placeholder="e.g. Payward A"
                className="!h-8 text-xs"
              />
            </Field>
          </section>
        )}

        <div className="mt-1 flex items-center gap-2 border-t border-sidebar-border pt-4">
          {activeStep !== "patient" && (
            <Button
              type="button"
              variant="outline"
              className="h-8 flex-1 text-xs font-medium"
              onClick={() =>
                setActiveStep(
                  activeStep === "location" ? "medications" : "patient"
                )
              }
            >
              Back
            </Button>
          )}
          {activeStep !== "location" ? (
            <Button
              type="button"
              className="h-8 flex-1 text-xs font-medium"
              onClick={() =>
                setActiveStep(
                  activeStep === "patient" ? "medications" : "location"
                )
              }
            >
              Continue
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                className="h-8 flex-1 text-xs font-medium"
              >
                Save as Draft
              </Button>
              <Button type="submit" className="h-8 flex-1 text-xs font-medium">
                Create Prescription
              </Button>
            </>
          )}
        </div>
      </form>
    </ResponsiveModal>
  )
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Label
        htmlFor={htmlFor}
        className="text-xs font-medium text-foreground dark:text-white"
      >
        {label}
      </Label>
      {children}
    </div>
  )
}
