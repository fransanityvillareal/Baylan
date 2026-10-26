import { ArrowLeft, Download, Printer } from "lucide-react"
import { Document, Image, Page, PDFViewer, StyleSheet, Text, View } from "@react-pdf/renderer"
import QRCode from "qrcode"
import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"

type Prescription = { id: string; patient: string; issued: string }

const styles = StyleSheet.create({
  page: { padding: 28, fontFamily: "Helvetica", color: "#555", fontSize: 8 },
  brand: { color: "#70004f", fontSize: 10, fontWeight: 700, letterSpacing: 1.2, marginBottom: 4 },
  title: { color: "#70004f", fontSize: 20, fontWeight: 700, textAlign: "center", letterSpacing: 0.5, marginBottom: 6 },
  bar: { height: 7, backgroundColor: "#ee3f49", marginHorizontal: -28, marginBottom: 11 },
  columns: { flexDirection: "row", gap: 20 },
  column: { flex: 1 },
  field: { marginBottom: 5 },
  label: { color: "#8c0b5d", marginBottom: 2 },
  section: { borderTop: 7, borderTopColor: "#ffc18d", paddingTop: 4, color: "#70004f", fontSize: 9, fontWeight: 700, marginTop: 3, marginBottom: 6 },
  card: { borderWidth: 1, borderColor: "#e1e2eb", padding: 7, marginBottom: 7 },
  muted: { color: "#777", fontSize: 8 },
  table: { borderWidth: 1, borderColor: "#dfe1ea" },
  row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#dfe1ea" },
  header: { backgroundColor: "#f0f0fa" },
  cell: { flex: 1, padding: 4, textAlign: "center", borderRightWidth: 1, borderRightColor: "#dfe1ea" },
  footer: { borderTopWidth: 1, borderTopColor: "#dfe1ea", marginTop: 9, paddingTop: 5, color: "#777", fontSize: 7 },
  qrBox: { width: 132, alignItems: "center", marginLeft: 12 },
  qr: { width: 120, height: 120 },
  qrCaption: { color: "#777", fontSize: 6, textAlign: "center", marginTop: 3 },
})

const medications = [
  ["Insulin Glargine (Glysolin G)", "Maintenance therapy", "50 MG", "Oral", "Once a day"],
  ["Expectorant", "Removes phlegm", "1 tablet", "Oral", "Every 4 hours"],
  ["Paracetamol", "For fever", "1 tablet", "Oral", "Every 4 hours"],
  ["Anti-biotic", "Bacterial infection", "500mg", "Oral", "Every 8 hours"],
  ["Vitamin C", "Immune system", "500mg", "Oral", "Once a day"],
  ["Vitamin D", "Immune System", "1 tablet", "Oral", "Once a day"],
]

export function PrescriptionPdfPreview({ prescription, onBack }: { prescription: Prescription; onBack: () => void }) {
  const [qrCode, setQrCode] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    void QRCode.toDataURL(`baylan://prescription/${prescription.id}`, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 180,
    }).then((dataUrl) => {
      if (active) setQrCode(dataUrl)
    })
    return () => {
      active = false
    }
  }, [prescription.id])

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button variant="outline" className="h-8 gap-2 text-xs" onClick={onBack}><ArrowLeft className="size-3.5" /> Back to prescriptions</Button>
        <div className="flex gap-2"><Button variant="outline" className="h-8 gap-2 text-xs" onClick={() => window.print()}><Printer className="size-3.5" /> Print</Button><Button variant="outline" className="h-8 gap-2 text-xs" onClick={() => window.print()}><Download className="size-3.5" /> Save PDF</Button></div>
      </div>
      <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto rounded-md border border-sidebar-border bg-[#eef0f5] p-3 sm:p-6">
        <PDFViewer className="h-[calc(100dvh-190px)] min-h-[820px] w-full" showToolbar={false}><PrescriptionDocument prescription={prescription} qrCode={qrCode} /></PDFViewer>
      </div>
    </div>
  )
}

function PrescriptionDocument({ prescription, qrCode }: { prescription: Prescription; qrCode: string | null }) {
  return (
    <Document title={`${prescription.id} Prescription`} author="Baylan Clinical Operations">
      <Page size="A4" style={styles.page} wrap={false}>
        <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
          <View><Text style={styles.brand}>BAYLAN CLINICAL OPERATIONS</Text><Text style={styles.muted}>Electronic prescription record</Text></View>
          <View style={styles.qrBox}>{qrCode && <Image src={qrCode} style={styles.qr} />}<Text style={styles.qrCaption}>Scan to verify {prescription.id}</Text></View>
        </View>
        <Text style={styles.title}>PRESCRIPTION TEMPLATE</Text>
        <View style={styles.bar} />
        <View style={styles.columns}>
          <View style={styles.column}><DocumentField label="Prescription No." value={prescription.id} /><DocumentField label="Encounter Type" value="In-patient" /></View>
          <View style={styles.column}><DocumentField label="Prescription Date" value={prescription.issued} /><DocumentField label="Validity" value="Active" /></View>
        </View>

        <Text style={styles.section}>Clinical Encounter</Text>
        <View style={styles.card}><Text>Payward in-patient prescription issued on October 13, 2026 for maintenance therapy and acute symptom management.</Text></View>

        <Text style={styles.section}>Patient Information</Text>
        <View style={styles.columns}>
          <View style={styles.column}><DocumentField label="Patient Name" value={prescription.patient} /><DocumentField label="Age / Sex" value="25 M" /><DocumentField label="Patient Health Record" value="HRN-2026-101326" /><DocumentField label="Charge Slip" value="CS-101326" /></View>
          <View style={styles.column}><DocumentField label="Official Receipt" value="OR-884920" /><DocumentField label="Encounter Date" value="October 13, 2026" /><DocumentField label="Allergies" value="Seafood" /><DocumentField label="Health Condition" value="None reported" /></View>
        </View>

        <Text style={styles.section}>Prescription Summary</Text>
        <View style={styles.card}>
          <View style={styles.columns}><View style={styles.column}><DocumentField label="Total Prescribed Medications" value="9 Medicines" /><DocumentField label="Oral Solid / Capsules" value="7 Items" /></View><View style={styles.column}><DocumentField label="Injectables / SubQ" value="1 Item" /><DocumentField label="Inhalation / Nebules" value="1 Item" /></View></View>
        </View>

        <Text style={styles.section}>Prescribed Items</Text>
        <View style={styles.table}><PdfRow values={["Generic Name", "Purpose", "Dose", "Route", "Frequency"]} header />{medications.map((medication) => <PdfRow key={medication[0]} values={medication} />)}</View>

        <Text style={styles.section}>Hospital Location</Text>
        <View style={styles.columns}><View style={styles.column}><DocumentField label="Healthcare Institution" value="Naga Imaging Center Cooperative (NICC) Doctors Hospital" /><DocumentField label="Address" value="San Rene, Naga City, Camarines Sur" /></View><View style={styles.column}><DocumentField label="Hospital Contact" value="09698678654" /><DocumentField label="Ward / Room" value="PAYWARD A" /></View></View>

        <Text style={styles.section}>Prescriber Credentials</Text>
        <View style={styles.columns}><View style={styles.column}><DocumentField label="Attending Physician" value="Dr. Marc Lester E. Sulit, MD" /><DocumentField label="PRC License No." value="0161271" /><DocumentField label="PTR No." value="[PTR Number]" /></View><View style={styles.column}><DocumentField label="S2 License No." value="N/A (Non-controlled Rx)" /><DocumentField label="Date Signed" value="10/13/2026" /><DocumentField label="Signature" value="A̷L̷H̷" /></View></View>
        <Text style={styles.footer}>This document is a generated prescription record from Baylan Clinical Operations. Verify the signed original before dispensing.</Text>
      </Page>
    </Document>
  )
}

function DocumentField({ label, value }: { label: string; value: ReactNode }) { return <View style={styles.field}><Text style={styles.label}>{label}</Text><Text>{value}</Text></View> }
function PdfRow({ values, header = false }: { values: string[]; header?: boolean }) { return <View style={[styles.row, header ? styles.header : {}]}>{values.map((value) => <Text key={value} style={styles.cell}>{value}</Text>)}</View> }
