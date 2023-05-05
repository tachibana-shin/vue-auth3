import { defineHttpDriver } from "../../type/drivers/HttpDriver"

const toString = Object.prototype.toString
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function type(obj: any): string {
  return toString.call(obj).slice(8, -1)
}

const parseJSON = (str: string) => {
  try {
    return JSON.parse(str)
  } catch {
    return str
  }
}

export default defineHttpDriver({
  request(config) {
    return fetch(config.url ?? "/", {
      ...config,
      body:
        typeof config.data === "object" && type(config.data) !== "FormData"
          ? new URLSearchParams(config.data)
          : config.data,
    }).then(async (res) => {
      // eslint-disable-next-line functional/no-let, @typescript-eslint/no-explicit-any
      let data: any
      switch (config.responseType) {
        case "arraybuffer":
          data = await res.arrayBuffer()
          break
        case "blob":
          data = await res.blob()
          break
        case "json":
          data = await res.json()
          break
        case "text":
          data = await res.text()
          break
        default:
          data = parseJSON(await res.text())
      }
      return {
        data,
        headers: Object.fromEntries(Array.from(res.headers.entries())),
        status: res.status,
        statusText: res.statusText,
      }
    })
  },
})
