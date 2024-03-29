import Auth from "../../Auth"

type HttpDriver = {
  request: (options: {
    url: string
    method?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any
    headers?: Record<string, string>
    responseType?: "arraybuffer" | "blob" | "json" | "text"
  }) => Promise<{
    headers: Record<string, string>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
    status: number
    statusText: string
  }>
  invalidToken?: (
    auth: Auth,
    response: Awaited<ReturnType<HttpDriver["request"]>>
  ) => boolean
}
export default HttpDriver
export function defineHttpDriver(opts: HttpDriver) {
  return opts
}
