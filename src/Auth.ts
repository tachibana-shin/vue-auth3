import { AxiosRequestConfig, AxiosResponse } from "axios"
import { App, reactive, shallowRef } from "vue"
import {
  RouteLocationNormalized,
  RouteLocationRaw,
  RouteMeta,
} from "vue-router"

import __defaultOption from "./defaultOption"
import $cookie from "./helpers/cookie"
import $token from "./helpers/token"
import getAuthMeta from "./helpme/getAuthMeta"
import { authKey } from "./injectionKey"
import Options from "./type/Options"
import Roles from "./type/Roles"
import { compare, getProperty, toArray } from "./utils"
import extend from "./utils/extend"

function processInvalidToken(auth: Auth, res: AxiosResponse): void {
  if (!auth.options.drivers.http.invalidToken?.(auth, res)) {
    return
  }

  // eslint-disable-next-line functional/no-let
  let redirect
  if (auth) {
    redirect = auth.redirect()?.to || auth.options.authRedirect
  }

  processLogout(auth, redirect)
}

function processLogout(auth: Auth, redirect?: RouteLocationRaw) {
  $cookie.remove(auth, auth.options.tokenImpersonateKey)
  $cookie.remove(auth, auth.options.tokenDefaultKey)

  $token.remove(auth, auth.options.tokenImpersonateKey)
  $token.remove(auth, auth.options.tokenDefaultKey)

  $token.remove(auth, auth.options.staySignedInKey)

  // eslint-disable-next-line functional/immutable-data
  auth.state.loaded = true
  // eslint-disable-next-line functional/immutable-data
  auth.state.authenticated = false
  // eslint-disable-next-line functional/immutable-data
  auth.state.data = null

  processRedirect(auth, redirect)
}

function processRedirect(auth: Auth, redirect?: RouteLocationRaw) {
  if (redirect) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    auth.options.plugins.router?.push(redirect).catch(() => {})
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function processFetch(auth: Auth, data: any, redirect?: RouteLocationRaw) {
  // eslint-disable-next-line functional/immutable-data
  auth.state.data = data

  // eslint-disable-next-line functional/immutable-data
  auth.state.loaded = true
  // eslint-disable-next-line functional/immutable-data
  auth.state.authenticated = true

  processRedirect(auth, redirect)
}

function processAuthenticated(auth: Auth, cb: () => void) {
  if (auth.state.authenticated === null && $token.get(auth, null)) {
    if (auth.options.fetchData.enabled) {
      auth.fetch()

      return
    }

    processFetch(auth, {})

    return cb()
  }

  // eslint-disable-next-line functional/immutable-data
  auth.state.loaded = true

  return cb()
}

function processRouterBeforeEach(auth: Auth, cb: () => void) {
  const isTokenExpired = !$token.get(auth, null)

  if (isTokenExpired && auth.state.authenticated) {
    processLogout(auth)
  }

  if (
    !isTokenExpired &&
    !auth.state.loaded &&
    auth.options.refreshData.enabled
  ) {
    auth.refresh().then(
      () => processAuthenticated(auth, cb),
      () => processAuthenticated(auth, cb)
    )

    return
  }

  processAuthenticated(auth, cb)
}
type Redirect =
  | RouteLocationRaw
  | ((to: RouteLocationNormalized) => RouteLocationRaw)
function processTransitionEach(
  auth: Auth,
  to: RouteLocationNormalized,
  authMeta: RouteMeta["auth"] | null,
  cb: (to?: RouteLocationRaw) => void
) {
  // eslint-disable-next-line functional/no-let
  let authRedirect: Redirect =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (authMeta as any)?.redirect ?? auth.options.authRedirect
  // eslint-disable-next-line functional/no-let
  let forbiddenRedirect: Redirect =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (authMeta as any)?.forbiddenRedirect ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (authMeta as any)?.redirect ||
    auth.options.forbiddenRedirect
  // eslint-disable-next-line functional/no-let
  let notFoundRedirect: Redirect =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (authMeta as any)?.notFoundRedirect ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (authMeta as any)?.redirect ||
    auth.options.notFoundRedirect
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rolesKey = (authMeta as any)?.rolesKey || auth.options.rolesKey

  const roles = toArray(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (authMeta as any)?.roles !== undefined
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (authMeta as any).roles
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (authMeta as any)
  ) as string[] | boolean | undefined

  if (
    roles === true ||
    (typeof roles === "object" && roles !== null) // is object or array
  ) {
    if (!auth.check()) {
      // eslint-disable-next-line functional/immutable-data
      auth.tStatusType = 401

      if (typeof authRedirect === "function") {
        authRedirect = authRedirect(to)
      }

      cb(authRedirect)

      return
    }
    if (
      typeof roles === "object" &&
      !compare(roles, getProperty(auth.state.data || {}, rolesKey))
    ) {
      // eslint-disable-next-line functional/immutable-data
      auth.tStatusType = 403

      if (typeof forbiddenRedirect === "function") {
        forbiddenRedirect = forbiddenRedirect(to)
      }

      cb(forbiddenRedirect)

      return
    }

    // eslint-disable-next-line functional/immutable-data
    auth._redirect.value = auth.tStatusType
      ? {
          type: auth.tStatusType,
          from: auth.tPrev,
          to: auth.tCurrent,
        }
      : null
    // eslint-disable-next-line functional/immutable-data
    auth.tStatusType = null

    cb()

    return
  }
  if (roles === false && auth.check()) {
    // eslint-disable-next-line functional/immutable-data
    auth.tStatusType = 404

    if (typeof notFoundRedirect === "function") {
      notFoundRedirect = notFoundRedirect(to)
    }

    cb(notFoundRedirect)

    return
  }

  // eslint-disable-next-line functional/immutable-data
  auth._redirect.value = auth.tStatusType
    ? {
        type: auth.tStatusType,
        from: auth.tPrev,
        to: auth.tCurrent,
      }
    : null
  // eslint-disable-next-line functional/immutable-data
  auth.tStatusType = null

  cb()
}

function setRemember(auth: Auth, val?: boolean) {
  if (val) {
    $token.set(auth, auth.options.rememberKey, val + "", false)
    // eslint-disable-next-line functional/immutable-data
    auth.state.remember = val
  } else {
    $token.remove(auth, auth.options.rememberKey)
    // eslint-disable-next-line functional/immutable-data
    auth.state.remember = null
  }
}

function setStaySignedIn(auth: Auth, staySignedIn?: boolean) {
  if (staySignedIn === true) {
    $token.set(auth, auth.options.staySignedInKey, "true", false)
  } else {
    $token.remove(auth, auth.options.staySignedInKey)
  }
}

function processImpersonate(
  auth: Auth,
  defaultToken: null | string,
  redirect?: RouteLocationRaw
) {
  if (auth.token()) {
    $token.set(
      auth,
      auth.options.tokenImpersonateKey,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      auth.token()!,
      $token.get(auth, auth.options.staySignedInKey) ? false : true
    )
  }
  $token.set(
    auth,
    auth.options.tokenDefaultKey,
    defaultToken + "",
    $token.get(auth, auth.options.staySignedInKey) ? false : true
  )
  // eslint-disable-next-line functional/immutable-data
  auth.state.impersonating = true

  processRedirect(auth, redirect)
}

function processUnimpersonate(auth: Auth, redirect?: undefined) {
  $token.remove(auth, auth.options.tokenImpersonateKey)
  // eslint-disable-next-line functional/immutable-data
  auth.state.impersonating = false

  processRedirect(auth, redirect)
}

function parseRedirectUri(uri = ""): string {
  if (/^https?:\/\//.test(uri)) {
    return uri
  }

  const url = `${location.protocol}//${window.location.hostname}${
    location.port ? `:${location.port}` : ""
  }`
  return `${url}/${uri.replace(/^\/|\/$/g, "")}`
}

export default class Auth {
  public readonly state = reactive({
    data: null,
    loaded: false,
    authenticated: <boolean | null>null, // TODO: false ?
    impersonating: <boolean | void>undefined,
    remember: <boolean | null>null,
  })
  public _redirect = shallowRef<{
    type: number | null
    from: RouteLocationNormalized | null
    to: RouteLocationNormalized | null
  } | null>(null)

  public readonly options: Required<Options>
  public currentToken: string | null = null
  public tPrev: RouteLocationNormalized | null = null
  public tCurrent: RouteLocationNormalized | null = null
  public tStatusType: number | null = null

  install(app: App, key: symbol | string = authKey) {
    app.provide(key, this)

    // eslint-disable-next-line functional/immutable-data
    app.config.globalProperties.$auth = this
  }

  constructor(options: Options) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.options = extend(__defaultOption, 2, options) as any

    // _initRefreshInterval()
    if (
      this.options.refreshData.enabled &&
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.options.refreshData.interval! > 0
    ) {
      setInterval(() => {
        if (this.options.refreshData.enabled && !!$token.get(this, null)) {
          this.refresh()
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      }, this.options.refreshData.interval! * 1000 * 60) // In minutes.
    }

    this.options.plugins.router?.beforeEach((to, from, next) => {
      this.tPrev = this.tCurrent
      this.tCurrent = from
      processRouterBeforeEach(this, () => {
        const authMeta = getAuthMeta(to)

        processTransitionEach(this, to, authMeta, (redirect) => {
          if (!redirect) {
            next()
            return
          }

          next(redirect)
        })
      })
    })
  }

  async http(
    options: AxiosRequestConfig & {
      ignoreVueAuth?: boolean
      impersonating?: boolean
    }
  ) {
    if (!options.ignoreVueAuth) {
      // eslint-disable-next-line functional/no-let
      let tokenName

      if (options.impersonating === false && this.impersonating()) {
        tokenName = this.options.tokenDefaultKey
      }

      const token = $token.get(this, tokenName ?? null)

      if (token) {
        const { data, headers } = this.options.drivers.auth.request(
          this,
          {
            data: options.data,
            headers: options.headers || {},
          },
          token
        )

        // eslint-disable-next-line functional/immutable-data
        options.data = data
        // eslint-disable-next-line functional/immutable-data
        options.headers = headers
      }
    }

    const response = await this.options.drivers.http.request(options)

    if (options.ignoreVueAuth) {
      return response
    }

    processInvalidToken(this, response)

    const token = this.options.drivers.auth.response(this, response)

    if (token) {
      $token.set(
        this,
        null,
        token,
        $token.get(this, this.options.staySignedInKey) ? false : true
      )
    }

    return response
  }

  ready() {
    return this.state.loaded
  }

  load() {
    return new Promise<void>((resolve) => {
      const timer: NodeJS.Timer | null = setInterval(() => {
        if (this.state.loaded) {
          clearInterval(timer as unknown as number)

          resolve()
        }
      }, 50)
    })
  }

  redirect() {
    return this._redirect.value
  }

  user(data: undefined) {
    if (data !== undefined) {
      processFetch(this, data)
    }

    return this.state.data
  }

  check(role?: Roles, key: string = this.options.rolesKey) {
    if (this.state.authenticated === true) {
      if (role) {
        return compare(role, getProperty(this.state.data || {}, key))
      }

      return true
    }

    return false
  }

  impersonating() {
    const impersonating = $token.get(this, this.options.tokenImpersonateKey)
      ? true
      : false

    if (this.state.impersonating === undefined) {
      // eslint-disable-next-line functional/immutable-data
      this.state.impersonating = impersonating
    }

    return this.state.impersonating
  }

  token(
    name: string | null = null,
    token: string | null = null,
    expires?: boolean
  ) {
    if (token !== undefined) {
      if (token === null) {
        $token.remove(this, name)
      } else {
        expires =
          expires === true || expires === false
            ? expires
            : $token.get(this, this.options.staySignedInKey)
            ? false
            : true

        $token.set(this, name, token, expires)
      }
    }

    return $token.get(this, name)
  }

  async fetch(data?: Options["fetchData"]) {
    const response = await this.http({
      ...this.options.fetchData,
      ...data,
    })

    processFetch(this, response, data?.redirect)

    return response
  }

  refresh(data?: Required<Options>["refreshData"]) {
    return this.http({
      ...this.options.refreshData,
      ...(data || {}),
    })
  }

  async register(data: Required<Options>["registerData"]) {
    const registerData = {
      ...this.options.registerData,
      ...data,
    }

    if (registerData.autoLogin !== true) {
      setRemember(this, registerData.remember)
      setStaySignedIn(this, registerData.staySignedIn)
    }

    const response = await this.http(registerData)

    if (registerData.autoLogin) {
      await this.login(data)

      return response
    }

    processRedirect(this, registerData.redirect)

    return response
  }

  async login(data: Required<Options>["loginData"]) {
    const loginData = {
      ...this.options.loginData,
      ...data,
    }

    setRemember(this, data.remember)
    setStaySignedIn(this, data.staySignedIn)

    const response = await this.http(loginData)

    if (data.fetchUser || this.options.fetchData.enabled) {
      await this.fetch({
        redirect: data.redirect,
      })
    } else {
      processFetch(this, response.data, data.redirect)
    }

    return response
  }

  remember(val: boolean) {
    if (val) {
      setRemember(this, val)
    }

    const remember = $token.get(this, this.options.rememberKey)

    if (this.state.remember === undefined) {
      // eslint-disable-next-line functional/immutable-data
      this.state.remember = remember === "true" ? true : false
    }

    return this.state.remember
  }

  unremember() {
    setRemember(this, void 0)
  }

  async logout(data: Required<Options>["logoutData"]) {
    const logoutData = {
      ...this.options.logoutData,
      ...data,
    }

    if (data.makeRequest) {
      await this.http(logoutData)
    }

    processLogout(this, data.redirect)
  }

  async impersonate(data: Required<Options>["impersonateData"]) {
    const impersonateData = {
      ...this.options.impersonateData,
      ...data,
    }
    const token = this.token()

    await this.http(impersonateData)

    processImpersonate(this, token)

    if (data.fetchUser || this.options.fetchData.enabled) {
      await this.fetch({
        redirect: data.redirect,
      })

      return
    }

    processRedirect(this, data.redirect)
  }

  async unimpersonate(data: Required<Options>["unimpersonateData"]) {
    const unimpersonateData = {
      ...this.options.unimpersonateData,
      ...data,
    }

    if (data.makeRequest) {
      await this.http(unimpersonateData)
    }

    processUnimpersonate(this)

    if (data.fetchUser || this.options.fetchData.enabled) {
      await this.fetch({
        redirect: data.redirect,
      })

      return
    }
  }

  oauth2(
    type: string | number,
    data: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      code: any
      state: string
      params: {
        [x: string]: string | number | boolean
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        state?: any
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        redirect_uri?: any
      }
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      url: any
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      window: any
    }
  ) {
    const params: string[] = []

    if (data.code) {
      try {
        if (data.state) {
          // eslint-disable-next-line functional/immutable-data
          data.state = JSON.parse(decodeURIComponent(data.state))
        }
      } catch (e) {
        console.error(
          "vue-auth:error There was an issue retrieving the state data."
        )
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data = extend(this.options.oauth2Data, 2, data.state, data) as any

      return this.login(data)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion
    data = extend((this.options.drivers.oauth2 as any)![type] as any, 2, data)

    // eslint-disable-next-line functional/immutable-data
    data.params.state = JSON.stringify(data.params.state || {})
    // eslint-disable-next-line functional/immutable-data
    data.params.redirect_uri = parseRedirectUri(data.params.redirect_uri)

    Object.keys(data.params).forEach((key) => {
      // eslint-disable-next-line functional/immutable-data
      params.push(`${key}=${encodeURIComponent(data.params[key])}`)
    })

    window.open(
      `${data.url}?${params.join("&")}`,
      (data.window || {}).name || "_self",
      (data.window || {}).specs || {}
    )
  }

  enableImpersonate() {
    if (this.impersonating()) {
      this.currentToken = null
    }
  }

  disableImpersonate() {
    if (this.impersonating()) {
      this.currentToken = this.options.tokenDefaultKey
    }
  }
}
