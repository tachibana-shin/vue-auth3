import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios"
import type { RouteLocationRaw, Router } from "vue-router"

import Auth from "../Auth"

import CookieOptions from "./CookieOptions"
import AuthDriver from "./drivers/AuthDriver"
import OAuth2Driver from "./drivers/OAuth2Driver"

type HttpData = AxiosRequestConfig &{
  redirect?: RouteLocationRaw
}
type Options = {
  //var
  rolesKey?: string
  rememberKey?: string
  userKey?: string;
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
    cacheUser?: boolean
  }

  logoutData?: HttpData & {
    makeRequest?: boolean
  }
  fetchData?: HttpData & {
    enabled?: boolean
    cache?: boolean;
  }
  refreshToken?: Omit<HttpData, "redirect"> & {
    enabled?: boolean
    interval?: number | false
  }
  impersonateData?: HttpData & {
    fetchUser?: boolean
    cacheUser?: boolean
  }
  unimpersonateData?: HttpData & {
    fetchUser?: boolean
    makeRequest?: boolean
    cacheUser?: boolean
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
    http: {
      request: AxiosInstance;
      invalidToken?: (auth: Auth, response: AxiosResponse) => boolean;
    }
    oauth2?: OAuth2Driver
  }
}

export default Options
