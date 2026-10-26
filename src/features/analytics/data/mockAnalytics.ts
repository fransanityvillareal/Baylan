export type DateRange = "7d" | "30d" | "90d" | "custom"

export const dateRangeLabels: Record<DateRange, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  custom: "Custom range",
}

export const trendData = [
  { date: "Oct 1", searches: 72, impressions: 410, views: 96 },
  { date: "Oct 5", searches: 104, impressions: 488, views: 124 },
  { date: "Oct 9", searches: 92, impressions: 452, views: 113 },
  { date: "Oct 13", searches: 138, impressions: 612, views: 154 },
  { date: "Oct 17", searches: 126, impressions: 584, views: 147 },
  { date: "Oct 21", searches: 174, impressions: 736, views: 198 },
  { date: "Oct 25", searches: 196, impressions: 804, views: 224 },
]

export const topMedicines = [
  { name: "Paracetamol", strength: "500 mg", form: "Tablet", searches: 842, trend: 18, demand: "High", category: "Pain relief" },
  { name: "Amoxicillin", strength: "500 mg", form: "Capsule", searches: 618, trend: 12, demand: "High", category: "Antibiotics" },
  { name: "Cetirizine", strength: "10 mg", form: "Tablet", searches: 486, trend: 7, demand: "Medium", category: "Allergy" },
  { name: "Metformin", strength: "500 mg", form: "Tablet", searches: 412, trend: -3, demand: "Medium", category: "Diabetes" },
  { name: "Losartan", strength: "50 mg", form: "Tablet", searches: 336, trend: 9, demand: "Medium", category: "Cardiovascular" },
]

export const inventoryCategories = [
  { name: "Pain relief", value: 38, color: "#ff3767" },
  { name: "Antibiotics", value: 24, color: "#8b5cf6" },
  { name: "Cardiovascular", value: 18, color: "#0ea5e9" },
  { name: "Diabetes", value: 12, color: "#14b8a6" },
  { name: "Other", value: 8, color: "#f59e0b" },
]

export const unfulfilledSearches = [
  { medicine: "Amlodipine", strength: "10 mg", form: "Tablet", searches: 126, status: "Not listed", demand: "High" },
  { medicine: "Insulin glargine", strength: "100 U/mL", form: "Injection", searches: 84, status: "Out of stock", demand: "High" },
  { medicine: "Azithromycin", strength: "500 mg", form: "Tablet", searches: 69, status: "Not listed", demand: "Medium" },
  { medicine: "Salbutamol", strength: "2 mg", form: "Tablet", searches: 42, status: "Low stock", demand: "Medium" },
  { medicine: "Omeprazole", strength: "20 mg", form: "Capsule", searches: 35, status: "Out of stock", demand: "Low" },
]

export const pharmacyNetwork = [
  { name: "Northstar Community Pharmacy", area: "Naga City Center", available: 284, appearances: 1890, views: 446, update: "Updated today", status: "Active" },
  { name: "Mabolo Care Pharmacy", area: "Mabolo", available: 241, appearances: 1612, views: 388, update: "Updated 2d ago", status: "Active" },
  { name: "Riverside Wellness Hub", area: "Triangulo", available: 198, appearances: 1294, views: 301, update: "Needs update", status: "Review" },
  { name: "Cedarline Drugstore", area: "Concepcion Grande", available: 176, appearances: 1108, views: 242, update: "Updated 5d ago", status: "Active" },
  { name: "Kapitbahay Health Mart", area: "Panicuason", available: 122, appearances: 706, views: 144, update: "Inactive 8d", status: "Paused" },
]

export const matchingOutcomes = [
  { name: "Single-pharmacy match", value: 44, color: "#ff3767" },
  { name: "Multi-pharmacy match", value: 29, color: "#8b5cf6" },
  { name: "Partial match", value: 17, color: "#f59e0b" },
  { name: "No match", value: 10, color: "#d4d4d8" },
]

export const coverageAreas = [
  { name: "Naga City Center", count: 12, share: 86 },
  { name: "Mabolo", count: 8, share: 67 },
  { name: "Triangulo", count: 6, share: 51 },
  { name: "Concepcion Grande", count: 5, share: 42 },
  { name: "Panicuason", count: 3, share: 25 },
]

export function scaledTrend(range: DateRange) {
  const factor = range === "7d" ? 0.45 : range === "90d" ? 1.55 : range === "custom" ? 0.8 : 1
  return trendData.map((point) => ({ ...point, searches: Math.round(point.searches * factor), impressions: Math.round(point.impressions * factor), views: Math.round(point.views * factor) }))
}
