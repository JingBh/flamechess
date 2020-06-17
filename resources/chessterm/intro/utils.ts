const baseUrl = document.querySelector('meta[name="data-backend"]').getAttribute("content")

export function url(uri: string) {
  if (uri.substring(0, 1) != "/") uri = "/" + uri
  return baseUrl + uri
}
