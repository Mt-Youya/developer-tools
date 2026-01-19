export function prefetch(url: string) {
  return fetch(url).then((res) => res.blob())
}
