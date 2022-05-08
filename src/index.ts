import Auth from "./Auth"
import Options from "./type/Options"
import AuthDriver from "./type/drivers/AuthDriver"
import HttpDriver from "./type/drivers/HttpDriver"
import OAuth2Driver from "./type/drivers/OAuth2Driver"
export * from "./injectionSymbols"
export * from "./useApi"

export function createAuth(options: Options) {
  return new Auth(options)
}

export type { Options, Auth, AuthDriver, HttpDriver, OAuth2Driver }

