import type { RouteLocationRaw, Router } from "vue-router"

import Auth from "../Auth"

import CookieOptions from "./CookieOptions"
import AuthDriver from "./drivers/AuthDriver"
import HttpDriver from "./drivers/HttpDriver"
import OAuth2Driver from "./drivers/OAuth2Driver"

type HttpData = Parameters< HttpDriver["request"]  >[0]& {
  redirect?: RouteLocationRaw
}
type Options = {
  //var
  rolesKey?: string
  rememberKey?: string
  userKey?: string
  staySignedInKey?: string
  tokenDefaultKey?: string
  tokenImpersonateKey?: string
  stores?: (
    | "cookie"
    | "storage"
    | {
        set: <T>(key: string, value: T, expires: boolean, auth: Auth) => void
        get: <T>(key: string) => T
        remove: (key: string) => void
      }
  )[]
  cookie?: CookieOptions

  // Redirects

  authRedirect?: RouteLocationRaw
  forbiddenRedirect?: RouteLocationRaw
  notFoundRedirect?: RouteLocationRaw

  // Http

  registerData?: HttpData & {
    autoLogin?: boolean
    fetchUser?: boolean
    staySignedIn?: boolean
    remember?: boolean
  }
  loginData?: HttpData & {
    fetchUser?: boolean
    staySignedIn?: boolean
    remember?: boolean
    cacheUser?: RequestCache
  }

  logoutData?: HttpData & {
    makeRequest?: boolean
  }
  fetchData?: HttpData & {
    enabled?: boolean
    cache?: RequestCache
    enabledInBackground?: boolean
  }
  refreshToken?: Omit<HttpData, "redirect"> & {
    enabled?: boolean
    enabledInBackground?: boolean
    interval?: number | false
  }
  impersonateData?: HttpData & {
    fetchUser?: boolean
    cacheUser?: RequestCache
  }
  unimpersonateData?: HttpData & {
    fetchUser?: boolean
    makeRequest?: boolean
    cacheUser?: RequestCache
  }
  oauth2Data?: HttpData & {
    fetchUser?: true
  }

  // Plugin

  plugins?: {
    router?: Router
  }

  // Driver

  drivers: {
    auth: AuthDriver
    http: HttpDriver
    oauth2?: {
      facebook?: OAuth2Driver
      google?: OAuth2Driver
    }
  }
}

export default Options
