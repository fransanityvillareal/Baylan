export interface PsgcLocation {
  code: string
  name: string
  region?: string
}

interface PsgcResponse {
  data: PsgcLocation[]
}

const API_BASE_URL = "https://psgc.cloud/api/v2"
const cache = new Map<string, Promise<PsgcLocation[]>>()

async function request(path: string): Promise<PsgcLocation[]> {
  const response = await fetch(`${API_BASE_URL}${path}`)
  if (!response.ok) throw new Error(`PSGC request failed (${response.status})`)
  const payload = (await response.json()) as PsgcResponse
  if (!payload || !Array.isArray(payload.data)) throw new Error("Invalid PSGC response")
  return payload.data
}

function cachedRequest(path: string) {
  const existing = cache.get(path)
  if (existing) return existing

  const pending = request(path).catch((error: unknown) => {
    cache.delete(path)
    throw error
  })
  cache.set(path, pending)
  return pending
}

export function getProvinces() {
  return withRetry(() => cachedRequest("/provinces"))
}

export function getCitiesMunicipalities(provinceCode: string) {
  return withRetry(() => cachedRequest(`/provinces/${encodeURIComponent(provinceCode)}/cities-municipalities`))
}

export function getBarangays(cityCode: string) {
  return withRetry(() => cachedRequest(`/cities-municipalities/${encodeURIComponent(cityCode)}/barangays`))
}

async function withRetry<T>(operation: () => Promise<T>, retries = 2): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (retries === 0) throw error
    await new Promise((resolve) => setTimeout(resolve, 400 * (3 - retries)))
    return withRetry(operation, retries - 1)
  }
}
