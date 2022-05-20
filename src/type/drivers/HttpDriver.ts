import { AxiosInstance, AxiosResponse } from "axios"

import Auth from "../../Auth"

// eslint-disable-next-line functional/no-mixed-type
type HttpDriver = {
  request: AxiosInstance
  invalidToken?: (auth: Auth, response: AxiosResponse) => boolean
}
export default HttpDriver
export function defineHttpDriver(opts: HttpDriver) {
  return opts
}
