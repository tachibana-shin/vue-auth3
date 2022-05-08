import { inject } from "vue"

import Auth from "./Auth"
import Options from "./type/Options"
import AuthDriver from "./type/drivers/AuthDriver"
import HttpDriver from "./type/drivers/HttpDriver"
import OAuth2Driver from "./type/drivers/OAuth2Driver"

export function createAuth(options: Options) {
  return new Auth(options)
}

export function useAuth(key = "auth"): Auth {
  return inject(key) as Auth
}

export type { Options, Auth, AuthDriver, HttpDriver, OAuth2Driver }

