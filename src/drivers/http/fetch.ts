import { defineHttpDriver } from "../../type/drivers/HttpDriver"

const toString = Object.prototype.toString
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function type(obj: any): string {
  return toString.call(obj).slice(8, -1)
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
      return {
        data: await res.json(),
        headers: Object.fromEntries(Array.from(res.headers.entries())),
        status: res.status,
        statusText: res.statusText,
      }
    })
  },
})
