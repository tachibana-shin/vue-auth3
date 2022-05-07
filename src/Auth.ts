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
import Options from "./type/Options"
import Roles from "./type/Roles"
import { compare, extend, getProperty, toArray } from "./utils"

function processInvalidToken(
  auth: Auth,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  res: any
) {
  if (
    !auth.options.drivers.http?.invalidToken ||
    !auth.options.drivers.http?.invalidToken(auth, res)
  ) {
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
      auth.fetch().then(cb, cb)
    } else {
      processFetch(auth, {})

      return cb()
    }
  } else {
    // eslint-disable-next-line functional/immutable-data
    auth.state.loaded = true

    return cb()
  }
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
      () => {
        processAuthenticated(auth, cb)
      },
      () => {
        processAuthenticated(auth, cb)
      }
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? (authMeta as any).roles
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
      : (authMeta as any)
    // eslint-disable-next-line functional/prefer-readonly-type
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

function _setStaySignedIn(auth: Auth, staySignedIn?: boolean) {
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

function _parseRedirectUri(uri = ""): string {
  if (/^https?:\/\//.test(uri)) {
    return uri
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return `${__defaultOption.getUrl!()}/${uri.replace(/^\/|\/$/g, "")}`
}

export default class Auth {
  public readonly state = reactive({
    data: null,
    loaded: false,
    authenticated: <boolean | null>null, // TODO: false ?
    impersonating: <boolean | void>undefined,
    remember: <boolean | null>null,
  })
  // eslint-disable-next-line functional/prefer-readonly-type
  public _redirect = shallowRef<{
    // eslint-disable-next-line functional/prefer-readonly-type
    type: number | null
    // eslint-disable-next-line functional/prefer-readonly-type
    from: RouteLocationNormalized | null
    // eslint-disable-next-line functional/prefer-readonly-type
    to: RouteLocationNormalized | null
  } | null>(null)

  public readonly options: Required<Options>
  // eslint-disable-next-line functional/prefer-readonly-type
  public currentToken: string | null = null
  // eslint-disable-next-line functional/prefer-readonly-type
  public tPrev: RouteLocationNormalized | null = null
  // eslint-disable-next-line functional/prefer-readonly-type
  public tCurrent: RouteLocationNormalized | null = null
  // eslint-disable-next-line functional/prefer-readonly-type
  public tStatusType: number | null = null

  install (app: App, key = "auth") {
    app.provide(key, this);

    // eslint-disable-next-line functional/immutable-data
    app.config.globalProperties.$auth = this;
  }

  constructor(options: Options) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.options = extend(__defaultOption, [options]) as any

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

    // _initInterceptors()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.options.drivers.http?.interceptor(
      this,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req: any) => {
        // eslint-disable-next-line functional/no-let
        let tokenName

        if (req && req.ignoreVueAuth) {
          return req
        }

        if (req.impersonating === false && this.impersonating()) {
          tokenName = this.options.tokenDefaultKey
        }

        const token = $token.get(this, tokenName ?? null)

        if (token) {
          this.options.drivers.auth.request(this, req, token)
        }

        return req
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (res: any, req: any) => {
        if (req && req.ignoreVueAuth) {
          return
        }

        processInvalidToken(this, res)

        const token = this.options.drivers.auth.response(this, res)

        if (token) {
          $token.set(
            this,
            null,
            token,
            $token.get(this, this.options.staySignedInKey) ? false : true
          )
        }
      }
    )
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

  ready() {
    return this.state.loaded
  }

  load() {
    return new Promise<void>((resolve) => {
      // eslint-disable-next-line functional/no-let
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
    data = extend(this.options.fetchData, [data])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await this.options.drivers.http.http(this, data).then((res: any) => {
      processFetch(
        this,
        this.options.parseUserData(
          this.options.drivers.http.httpData(this, res)
        ),
        data?.redirect
      )

      return res
    })
  }

  refresh(data: Partial<Options["refreshData"]> = {}) {
    data = extend(this.options.refreshData, [data])

    return this.options.drivers.http.http(this, data)
  }

  register(data: Required<Options>["registerData"]) {
    const registerData = extend(this.options.registerData, [data])

    if (registerData.autoLogin !== true) {
      setRemember(this, registerData.remember)
      _setStaySignedIn(this, registerData.staySignedIn)
    }

    return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.options.drivers.http.http(this, registerData).then((res: any) => {
        if (registerData.autoLogin) {
          const loginData = extend(this.options.loginData, [
            data,
          ]) as Required<Options>["loginData"]

          this.login(loginData).then(resolve, reject)
        } else {
          resolve(res)

          processRedirect(this, registerData.redirect)
        }
      }, reject)
    })
  }

  login(data: Required<Options>["loginData"]) {
    data = extend(this.options.loginData, [data])

    setRemember(this, data.remember)
    _setStaySignedIn(this, data.staySignedIn)

    return new Promise((resolve, reject) => {
      this.options.drivers.http.http(this, data).then(
        (res: unknown) => {
          if (
            data.fetchUser ||
            (data.fetchUser === undefined && this.options.fetchData.enabled)
          ) {
            this.fetch({
              redirect: data.redirect,
            }).then(resolve, reject)
          } else {
            processFetch(
              this,
              this.options.parseUserData(
                this.options.drivers.http.httpData(this, res)
              ),
              data.redirect
            )

            resolve(res)
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (res: any) => {
          // eslint-disable-next-line functional/immutable-data
          this.state.loaded = true
          // eslint-disable-next-line functional/immutable-data
          this.state.authenticated = false

          reject(res)
        }
      )
    })
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

  logout(data: Required<Options>["logoutData"]) {
    data = extend(this.options.logoutData, [data])

    return new Promise<void>((resolve, reject) => {
      if (data.makeRequest) {
        this.options.drivers.http.http(this, data).then(() => {
          processLogout(this, data.redirect)

          resolve()
        }, reject)
      } else {
        processLogout(this, data.redirect)

        resolve()
      }
    })
  }

  impersonate(data: Required<Options>["impersonateData"]) {
    data = extend(this.options.impersonateData, [data])

    return new Promise((resolve, reject) => {
      const token = this.token()

      this.options.drivers.http.http(this, data).then((res: unknown) => {
        processImpersonate(this, token)

        if (
          data.fetchUser ||
          (data.fetchUser === undefined && this.options.fetchData.enabled)
        ) {
          this.fetch({
            redirect: data.redirect,
          }).then(resolve, reject)
        } else {
          processRedirect(this, data.redirect)

          resolve(res)
        }
      }, reject)
    })
  }

  unimpersonate(data: Required<Options>["unimpersonateData"]) {
    data = extend(this.options.unimpersonateData, [data])

    return new Promise<void>((resolve, reject) => {
      if (data.makeRequest) {
        this.options.drivers.http.http(this, data).then(resolve, reject)
      } else {
        resolve()
      }
    }).then(
      () =>
        new Promise<void>((resolve, reject) => {
          processUnimpersonate(this)

          if (
            data.fetchUser ||
            (data.fetchUser === undefined && this.options.fetchData.enabled)
          ) {
            this.fetch({
              redirect: data.redirect,
            }).then(resolve, reject)
          } else {
            processRedirect(this, data.redirect)

            resolve()
          }
        })
    )
  }

  oauth2(
    type: string | number,
    data: {
      // eslint-disable-next-line functional/prefer-readonly-type, @typescript-eslint/no-explicit-any
      code: any
      // eslint-disable-next-line functional/prefer-readonly-type
      state: string
      // eslint-disable-next-line functional/prefer-readonly-type
      params: {
        // eslint-disable-next-line functional/prefer-readonly-type
        [x: string]: string | number | boolean
        // eslint-disable-next-line functional/prefer-readonly-type, @typescript-eslint/no-explicit-any
        state?: any
        // eslint-disable-next-line functional/prefer-readonly-type, @typescript-eslint/no-explicit-any
        redirect_uri?: any
      }
        // eslint-disable-next-line functional/prefer-readonly-type, @typescript-eslint/no-explicit-any
      url: any
        // eslint-disable-next-line functional/prefer-readonly-type, @typescript-eslint/no-explicit-any
      window: any
    }
  ) {
    // eslint-disable-next-line functional/prefer-readonly-type
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
      data = extend(this.options.oauth2Data, [data.state, data]) as any

      return this.login(data)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion
    data = extend((this.options.drivers.oauth2 as any)![type] as any, [data])

    // eslint-disable-next-line functional/immutable-data
    data.params.state = JSON.stringify(data.params.state || {})
    // eslint-disable-next-line functional/immutable-data
    data.params.redirect_uri = _parseRedirectUri(data.params.redirect_uri)

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

