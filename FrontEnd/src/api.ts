const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '')

export function apiUrl(input: RequestInfo | URL): RequestInfo | URL {
  if (!apiBaseUrl) return input

  const path = input instanceof Request ? input.url : input.toString()
  if (/^https?:\/\//i.test(path)) return input

  return `${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`
}