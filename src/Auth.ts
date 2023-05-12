/* eslint-disable @typescript-eslint/ban-types */
import { AxiosError } from "axios"
import { App, DeepReadonly, reactive, shallowRef, watch } from "vue"
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
import HttpDriver from "./type/drivers/HttpDriver"
import { compare, getProperty, toArray } from "./utils"
import extend from "./utils/extend"

function logout(auth: Auth, redirect?: RouteLocationRaw) {
  $cookie.remove(auth, auth.options.tokenImpersonateKey)
  $cookie.remove(auth, auth.options.tokenDefaultKey)

  $token.remove(auth, auth.options.tokenImpersonateKey)
  $token.remove(auth, auth.options.tokenDefaultKey)

  $token.remove(auth, auth.options.staySignedInKey)

  $token.remove(auth, auth.options.userKey)

  // eslint-disable-next-line functional/immutable-data
  auth.state.loaded = true
  // eslint-disable-next-line functional/immutable-data
  auth.state.authenticated = false
  // eslint-disable-next-line functional/immutable-data
  auth.state.data = null

  routerPush(auth, redirect)
}

function routerPush(auth: Auth, redirect?: RouteLocationRaw) {
  if (redirect) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    auth.options.plugins?.router?.push(redirect).catch(() => {})
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setUserData(auth: Auth, data: any, redirect?: RouteLocationRaw) {
  // eslint-disable-next-line functional/immutable-data
  auth.state.data = data

  // eslint-disable-next-line functional/immutable-data
  auth.state.loaded = true
  // eslint-disable-next-line functional/immutable-data
  auth.state.authenticated = true

  routerPush(auth, redirect)
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
    $token.set(auth, auth.options.rememberKey, val, false)
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
    $token.set(auth, auth.options.staySignedInKey, true, false)
  } else {
    $token.remove(auth, auth.options.staySignedInKey)
  }
}

function processImpersonate(
  auth: Auth,
  defaultToken: string | null,
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
    defaultToken,
    $token.get(auth, auth.options.staySignedInKey) ? false : true
  )
  // eslint-disable-next-line functional/immutable-data
  auth.state.impersonating = true

  routerPush(auth, redirect)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function processUnimpersonate(auth: Auth, redirect?: any) {
  $token.remove(auth, auth.options.tokenImpersonateKey)
  // eslint-disable-next-line functional/immutable-data
  auth.state.impersonating = false

  routerPush(auth, redirect)
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isAxiosError = (err: any): err is AxiosError => err?.isAxiosError
function authErrHandler(auth: Auth, err: AxiosError | Response) {
  const status = isAxiosError(err) ? err.response?.status : err.status

  if (status === 401) {
    const isTokenExpired = !$token.get(auth, null)

    if (isTokenExpired) auth.logout().catch(() => logout(auth))
  }

  // eslint-disable-next-line functional/immutable-data
  auth.state.offline = true
}

// eslint-disable-next-line functional/no-let
let syning: Promise<void> | null = null
function syncStorage(auth: Auth) {
  if (syning) return syning

  return (syning = _syncStorage(auth))
}
async function _syncStorage(auth: Auth) {
  const isTokenExpired = !$token.get(auth, null)

  if (isTokenExpired && auth.state.authenticated) {
    logout(auth)
  }

  // eslint-disable-next-line functional/no-let
  let promiseRefresh: Promise<unknown> | null = null
  if (!isTokenExpired && !auth.state.loaded) {
    if (auth.options.refreshToken.enabled) {
      promiseRefresh = auth.refresh().catch((err) => authErrHandler(auth, err))

      if (!auth.options.refreshToken.enabledInBackground) await promiseRefresh
    }
  }

  if (auth.state.authenticated === null && $token.get(auth, null)) {
    const userCache = $token.get(auth, auth.options.userKey) // user data on save

    if (userCache && auth.state.cacheUser) {
      // if usercache exists and this session cacheUser active
      setUserData(auth, userCache)
    }

    if (auth.options.fetchData.enabled && !auth.state.cacheUser) {
      // eslint-disable-next-line functional/no-let
      let fetchPromise: Promise<unknown> | null = null
      if (auth.options.fetchData.waitRefresh && promiseRefresh)
        fetchPromise = promiseRefresh.then(() =>
          auth.fetch().catch((err) => authErrHandler(auth, err))
        )
      else fetchPromise = auth.fetch().catch((err) => authErrHandler(auth, err))

      if (!auth.options.fetchData.enabledInBackground) await fetchPromise
    }
  } else {
    $token.remove(auth, auth.options.userKey)
    // eslint-disable-next-line functional/immutable-data
    auth.state.loaded = true
  }
}

export default class Auth {
  public readonly state = reactive({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: <any | null>null,
    loaded: false,
    offline: false,
    authenticated: <boolean | null>null, // TODO: false ?
    impersonating: <boolean | null>null,
    remember: <boolean | null>null,
    cacheUser: <boolean>false,
  })
  public _redirect = shallowRef<{
    type: number | null
    from: RouteLocationNormalized | null
    to: RouteLocationNormalized | null
  } | null>(null)

  public readonly options: typeof __defaultOption & DeepReadonly<Options>
  public currentToken: string | null = null
  public tPrev: RouteLocationNormalized | null = null
  public tCurrent: RouteLocationNormalized | null = null
  public tStatusType: number | null = null

  public install(app: App, key: symbol | string = authKey) {
    app.provide(key, this)

    // eslint-disable-next-line functional/immutable-data
    app.config.globalProperties.$auth = this
  }

  constructor(options: Options) {
    this.options = extend(__defaultOption, 2, options)

    this.state.cacheUser = this.options.fetchData.cache ?? false

    // eslint-disable-next-line functional/no-let
    let dataWatcher: ReturnType<typeof watch> | null
    watch(
      () => this.state.cacheUser,
      (value) => {
        if (value) {
          //cache init ;
          dataWatcher = watch(
            () => this.state.data,
            (data) => {
              if (this.token())
                $token.set(this, this.options.userKey, data, false)
            },
            {
              deep: true,
            }
          )
        } else {
          dataWatcher?.()
          $token.remove(this, this.options.userKey)
        }
      },
      {
        immediate: true,
      }
    )

    // _initRefreshInterval()
    if (
      (this.options.refreshToken.enabled ||
        this.options.refreshToken.enabledInBackground) &&
      this.options.refreshToken.interval !== false &&
      this.options.refreshToken.interval !== void 0 &&
      this.options.refreshToken.interval > 0
    ) {
      setInterval(() => {
        if (
          (this.options.refreshToken.enabled ||
            this.options.refreshToken.enabledInBackground) &&
          !!$token.get(this, null)
        ) {
          this.refresh().catch((err) => authErrHandler(this, err))
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      }, this.options.refreshToken.interval! * 1000 * 60) // In minutes.
    }

    if (this.options.initSync) syncStorage(this)

    this.options.plugins?.router?.beforeEach(async (to, from, next) => {
      this.tPrev = this.tCurrent
      this.tCurrent = from

      await syncStorage(this)

      const authMeta = getAuthMeta(to)

      processTransitionEach(this, to, authMeta, (redirect) => {
        if (!redirect) {
          next()
          return
        }

        next(redirect)
      })
    })
  }

  async http<OtherOptions extends object>(
    options: OtherOptions &
      Parameters<HttpDriver["request"]>[0] & {
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

      const token = $token.get<string | null>(this, tokenName ?? null)

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

    if (this.options.drivers.http.invalidToken?.(this, response)) {
      logout(this, this.redirect()?.to || this.options.authRedirect)
    }

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

  private __timer_load: NodeJS.Timer | null | undefined
  load() {
    return new Promise<void>((resolve) => {
      this.__timer_load = setInterval(() => {
        if (this.state.loaded) {
          clearInterval(this.__timer_load as unknown as number)

          resolve()
        }
      }, 50)
    })
  }

  cancel() {
    clearInterval(this.__timer_load as unknown as number)
  }

  redirect() {
    return this._redirect.value
  }

  user<U extends object>(data?: U): U | null {
    if (data !== undefined) {
      setUserData(this, data)
    }

    return this.state.data
  }
  offline() {
    return this.state.offline
  }

  check(role?: Roles, key: string = this.options.rolesKey) {
    if (this.state.authenticated) {
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

    if (this.state.impersonating === null) {
      // eslint-disable-next-line functional/immutable-data
      this.state.impersonating = impersonating
    }

    return this.state.impersonating
  }

  token(name: string | null = null, token?: string | null, expires?: boolean) {
    if (token !== undefined) {
      if (token === null) {
        $token.remove(this, name)
      } else {
        expires =
          expires ??
          ($token.get(this, this.options.staySignedInKey) ? false : true)

        $token.set(this, name, token, expires)
      }
    }

    return $token.get<string | null>(this, name)
  }

  /**
   * @request auth/user
   * @returns Promise<user data> info user data (exm: {
   * 
        username: "Tachibana Shin",

        email: "asjwepit32r@duck.com"

    })
   */
  async fetch<OtherOptions extends object>(
    data?: OtherOptions & Partial<Options["fetchData"]>
  ) {
    const fetchData = {
      ...this.options.fetchData,
      ...data,
      cache: data?.cache ?? this.state.cacheUser,
    }
    const response = await this.http(fetchData)

    // eslint-disable-next-line functional/immutable-data
    this.state.cacheUser = fetchData.cache ?? this.state.cacheUser

    const keyUser = fetchData.keyUser
    setUserData(
      this,
      keyUser ? response.data[keyUser] : response.data,
      data?.redirect
    )

    return response
  }

  /**
   * @request auth/refresh
   * @returns Promise exists token refresh in Authorizer
   */
  public refresh<OtherOptions extends object>(
    data?: OtherOptions & Required<Options>["refreshToken"]
  ) {
    return this.http({
      ...this.options.refreshToken,
      ...(data || {}),
    })
  }

  async register<OtherOptions extends object>(
    data?: OtherOptions & Required<Options>["registerData"]
  ) {
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

    const keyUser =
      "keyUser" in registerData
        ? registerData.keyUser
        : this.options.fetchData.keyUser
    setUserData(
      this,
      keyUser ? response.data[keyUser] : response.data,
      registerData.redirect
    )

    return response
  }

  async login<OtherOptions extends object>(
    data?: OtherOptions & Required<Options>["loginData"]
  ) {
    const loginData = {
      ...this.options.loginData,
      ...data,
    }

    setRemember(this, loginData.remember)
    setStaySignedIn(this, loginData.staySignedIn)

    const response = await this.http(loginData)

    if (loginData.fetchUser && this.options.fetchData.enabled) {
      await this.fetch({
        redirect: loginData.redirect,
        cache: loginData.cacheUser,
      })
    } else {
      const keyUser =
        "keyUser" in loginData
          ? loginData.keyUser
          : this.options.fetchData.keyUser
      setUserData(
        this,
        keyUser ? response.data[keyUser] : response.data,
        loginData.redirect
      )
    }

    return response
  }

  remember(val: boolean) {
    if (val) {
      setRemember(this, val)
    }

    const remember = $token.get<boolean>(this, this.options.rememberKey)

    if (this.state.remember === undefined) {
      // eslint-disable-next-line functional/immutable-data
      this.state.remember = remember ?? false
    }

    return this.state.remember
  }

  unremember() {
    setRemember(this, void 0)
  }

  async logout<OtherOptions extends object>(
    data?: OtherOptions & Required<Options>["logoutData"]
  ) {
    const logoutData = {
      ...this.options.logoutData,
      ...data,
    }

    if (logoutData.makeRequest) {
      await this.http(logoutData)
    }

    logout(this, logoutData.redirect)
  }

  async impersonate<OtherOptions extends object>(
    data?: OtherOptions & Required<Options>["impersonateData"]
  ) {
    const impersonateData = {
      ...this.options.impersonateData,
      ...data,
    }
    const token = this.token()

    await this.http(impersonateData)

    processImpersonate(this, token)

    if (impersonateData.fetchUser || this.options.fetchData.enabled) {
      await this.fetch({
        redirect: impersonateData.redirect,
        cache: impersonateData.cacheUser,
      })

      return
    }

    routerPush(this, impersonateData.redirect)
  }

  async unimpersonate<OtherOptions extends object>(
    data?: OtherOptions & Required<Options>["unimpersonateData"]
  ) {
    const unimpersonateData = {
      ...this.options.unimpersonateData,
      ...data,
    }

    if (unimpersonateData.makeRequest) {
      await this.http(unimpersonateData)
    }

    processUnimpersonate(this)

    if (unimpersonateData.fetchUser || this.options.fetchData.enabled) {
      await this.fetch({
        redirect: unimpersonateData.redirect,
        cache: unimpersonateData.cacheUser,
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
