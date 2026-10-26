import { useId, useState } from "react"
import type { ReactNode } from "react"
import { Download } from "lucide-react"
import { ResponsiveModal } from "@/components/ui/responsive-modal"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type DataExportModalProps = {
  children: ReactNode
  title: string
  description: string
  filename: string
  headers: string[]
  rows: Array<Array<string | number>>
  allRows?: Array<Array<string | number>>
}

export function DataExportModal({
  children,
  title,
  description,
  filename,
  headers,
  rows,
  allRows = rows,
}: DataExportModalProps) {
  const id = useId()
  const [format, setFormat] = useState("csv")
  const [scope, setScope] = useState("current")
  const [open, setOpen] = useState(false)
  const selectedRows = scope === "all" ? allRows : rows

  const download = () => {
    const content =
      format === "json"
        ? JSON.stringify(
            selectedRows.map((row) =>
              Object.fromEntries(
                headers.map((header, index) => [header, row[index]])
              )
            ),
            null,
            2
          )
        : [headers, ...selectedRows]
            .map((row) =>
              row
                .map((value) => `"${String(value).replaceAll('"', '""')}"`)
                .join(",")
            )
            .join("\n")
    const blob = new Blob([content], {
      type: format === "json" ? "application/json" : "text/csv;charset=utf-8",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${filename}.${format}`
    link.click()
    URL.revokeObjectURL(url)
    setOpen(false)
  }

  const optionClass = "flex items-start gap-2.5 [&_svg]:mt-0.5 [&_svg]:shrink-0"
  const radioClass =
    "border-sidebar-border data-[state=checked]:border-foreground data-[state=checked]:text-foreground dark:data-[state=checked]:border-white dark:data-[state=checked]:text-white"

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={setOpen}
      trigger={children}
      title={title}
      description={description}
      className="sm:max-w-[425px]"
    >
      <div className="flex flex-col gap-5 py-2">
        <section className="flex flex-col gap-3">
          <h4 className="text-xs font-medium text-foreground dark:text-white">
            File Format
          </h4>
          <RadioGroup
            value={format}
            onValueChange={setFormat}
            className="gap-3"
          >
            <div className={optionClass}>
              <RadioGroupItem
                value="csv"
                id={`${id}-csv`}
                className={radioClass}
              />
              <Label
                htmlFor={`${id}-csv`}
                className="text-xs leading-4 font-normal"
              >
                <span className="text-foreground dark:text-white">
                  CSV Spreadsheet
                </span>{" "}
                <span className="text-muted-foreground">
                  Best for importing and manual review
                </span>
              </Label>
            </div>
            <div className={optionClass}>
              <RadioGroupItem
                value="json"
                id={`${id}-json`}
                className={radioClass}
              />
              <Label
                htmlFor={`${id}-json`}
                className="text-xs leading-4 font-normal"
              >
                <span className="text-foreground dark:text-white">
                  JSON Data
                </span>{" "}
                <span className="text-muted-foreground">
                  Best for system integrations
                </span>
              </Label>
            </div>
          </RadioGroup>
        </section>
        <section className="flex flex-col gap-3">
          <h4 className="text-xs font-medium text-foreground dark:text-white">
            Data Scope
          </h4>
          <RadioGroup value={scope} onValueChange={setScope} className="gap-3">
            <div className={optionClass}>
              <RadioGroupItem
                value="current"
                id={`${id}-current`}
                className={radioClass}
              />
              <Label
                htmlFor={`${id}-current`}
                className="text-xs leading-4 font-normal"
              >
                <span className="text-foreground dark:text-white">
                  Current Filtered View
                </span>{" "}
                <span className="text-muted-foreground">
                  ({rows.length} {rows.length === 1 ? "item" : "items"})
                </span>
              </Label>
            </div>
            <div className={optionClass}>
              <RadioGroupItem
                value="all"
                id={`${id}-all`}
                className={radioClass}
              />
              <Label
                htmlFor={`${id}-all`}
                className="text-xs leading-4 font-normal"
              >
                <span className="text-foreground dark:text-white">
                  All Records
                </span>{" "}
                <span className="text-muted-foreground">
                  ({allRows.length} {allRows.length === 1 ? "item" : "items"})
                </span>
              </Label>
            </div>
          </RadioGroup>
        </section>
        <section className="flex flex-col gap-3">
          <h4 className="text-xs font-medium text-foreground dark:text-white">
            Included Columns
          </h4>
          <RadioGroup defaultValue="standard" className="gap-3">
            <div className={optionClass}>
              <RadioGroupItem
                value="standard"
                id={`${id}-standard`}
                className={radioClass}
              />
              <Label
                htmlFor={`${id}-standard`}
                className="text-xs leading-4 font-normal"
              >
                <span className="text-foreground dark:text-white">
                  Standard View
                </span>{" "}
                <span className="text-muted-foreground">
                  Matches the current table columns
                </span>
              </Label>
            </div>
            <div className={optionClass}>
              <RadioGroupItem
                value="all-fields"
                id={`${id}-all-fields`}
                className={radioClass}
              />
              <Label
                htmlFor={`${id}-all-fields`}
                className="text-xs leading-4 font-normal"
              >
                <span className="text-foreground dark:text-white">
                  All Available Fields
                </span>{" "}
                <span className="text-muted-foreground">
                  Includes the available record details
                </span>
              </Label>
            </div>
          </RadioGroup>
        </section>
        <div className="flex items-center gap-2 border-t border-sidebar-border pt-4">
          <Button
            variant="outline"
            className="h-8 flex-1 text-xs"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="h-8 flex-1 gap-1.5 text-xs font-medium"
            onClick={download}
          >
            <Download className="h-3.5 w-3.5" />
            {title}
          </Button>
        </div>
      </div>
    </ResponsiveModal>
  )
}
