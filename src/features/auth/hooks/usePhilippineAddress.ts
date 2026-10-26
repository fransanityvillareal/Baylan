import { useCallback, useEffect, useState } from "react"
import { getBarangays, getCitiesMunicipalities, getProvinces, type PsgcLocation } from "@/features/auth/api/psgcApi"

export interface PhilippineAddress {
  provinceCode: string
  provinceName: string
  cityCode: string
  cityName: string
  barangayCode: string
  barangayName: string
  streetAddress: string
}

export function usePhilippineAddress(initial: Partial<PhilippineAddress> = {}) {
  const [provinces, setProvinces] = useState<PsgcLocation[]>([])
  const [cities, setCities] = useState<PsgcLocation[]>([])
  const [barangays, setBarangays] = useState<PsgcLocation[]>([])
  const [address, setAddress] = useState<PhilippineAddress>({
    provinceCode: initial.provinceCode ?? "", provinceName: initial.provinceName ?? "",
    cityCode: initial.cityCode ?? "", cityName: initial.cityName ?? "",
    barangayCode: initial.barangayCode ?? "", barangayName: initial.barangayName ?? "",
    streetAddress: initial.streetAddress ?? "",
  })
  const [loading, setLoading] = useState({ provinces: true, cities: false, barangays: false })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    getProvinces().then((items) => { if (active) setProvinces(items) }).catch(() => { if (active) setError("Unable to load provinces. Please retry.") }).finally(() => { if (active) setLoading((value) => ({ ...value, provinces: false })) })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!address.provinceCode) return
    let active = true
    setLoading((value) => ({ ...value, cities: true })); setError(null)
    getCitiesMunicipalities(address.provinceCode).then((items) => { if (active) setCities(items) }).catch(() => { if (active) setError("Unable to load cities and municipalities. Please retry.") }).finally(() => { if (active) setLoading((value) => ({ ...value, cities: false })) })
    return () => { active = false }
  }, [address.provinceCode])

  useEffect(() => {
    if (!address.cityCode) return
    let active = true
    setLoading((value) => ({ ...value, barangays: true })); setError(null)
    getBarangays(address.cityCode).then((items) => { if (active) setBarangays(items) }).catch(() => { if (active) setError("Unable to load barangays. Please retry.") }).finally(() => { if (active) setLoading((value) => ({ ...value, barangays: false })) })
    return () => { active = false }
  }, [address.cityCode])

  const update = useCallback((key: keyof PhilippineAddress, value: string) => setAddress((current) => ({ ...current, [key]: value })), [])
  const selectProvince = useCallback((item: PsgcLocation) => setAddress((current) => ({ ...current, provinceCode: item.code, provinceName: item.name, cityCode: "", cityName: "", barangayCode: "", barangayName: "", streetAddress: "" })), [])
  const selectCity = useCallback((item: PsgcLocation) => setAddress((current) => ({ ...current, cityCode: item.code, cityName: item.name, barangayCode: "", barangayName: "", streetAddress: "" })), [])
  const selectBarangay = useCallback((item: PsgcLocation) => setAddress((current) => ({ ...current, barangayCode: item.code, barangayName: item.name, streetAddress: "" })), [])
  const retry = useCallback(() => { setError(null); setLoading((value) => ({ ...value, provinces: true })); getProvinces().then(setProvinces).catch(() => setError("Unable to load provinces. Please retry.")).finally(() => setLoading((value) => ({ ...value, provinces: false }))) }, [])
  return { address, provinces, cities, barangays, loading, error, update, selectProvince, selectCity, selectBarangay, retry }
}
