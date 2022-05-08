import { AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from "axios"

import Auth from "../../Auth"

type OptionRequest = {
  data?: AxiosRequestConfig["data"]
  headers: AxiosRequestHeaders
}

type AuthDriver = {
  tokens?: string[]
  request: (auth: Auth, options: OptionRequest, token: string) => OptionRequest
  response: (auth: Auth, response: AxiosResponse) => string | null
}

export default AuthDriver
