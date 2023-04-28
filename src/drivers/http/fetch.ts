import { defineHttpDriver } from "../../type/drivers/HttpDriver"

export default defineHttpDriver({
  request(config) {
    return fetch(config.url ?? "/", {
      ...config,
      body: typeof config.data === "object" ? new URLSearchParams(config.data) : config.data,
    }).then(async res => {
      return {
        data: await res.json(),
        headers: Object.fromEntries(Array.from( res.headers.entries() ))
      }
    })
  }
})
