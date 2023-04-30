<p align="center">
  <img src="./docs/public/icon.svg" width="180px">
</p>

# vue-auth3

This plugin is a combination of @websanova/vue-auth and Vue3 and Axios!
[View docs](https://vue-auth3.js.org)

[![Build](https://github.com/tachibana-shin/vue-auth3/actions/workflows/docs.yml/badge.svg)](https://github.com/tachibana-shin/vue-auth3/actions/workflows/docs.yml)
[![NPM](https://badge.fury.io/js/vue-auth3.svg)](http://badge.fury.io/js/vue-auth3)

## Installation

NPM / Yarn / Pnpm:

```bash
pnpm add vue-auth3
```

CDN:

```html
<script src="https://unpkg.com/vue-auth3"></script>
```

## Example boot/auth.ts for Quasar Framework

```ts
import { createAuth } from "vue-auth3"
import { boot } from "quasar/wrappers"
import driverAuthBearer from "vue-auth3/drivers/auth/bearer"

export default boot(({ app, router, store }) => {
  const auth = createAuth({
    rolesKey: "type",
    notFoundRedirect: "/",
    fetchData: {
      enabled: true,
      cache: true,
    },
    refreshToken: {
      enabled: false,
    },

    plugins: {
      router,
    },
    drivers: {
      http: {
        request: app.config.globalProperties.$api,
      },
      auth: driverAuthBearer,
    },
  })

  app.use(auth)
})
```

## Options

Options.d.ts

```ts
type HttpData = AxiosRequestConfig & {
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
    keyUser?: string
    autoLogin?: boolean
    fetchUser?: boolean
    staySignedIn?: boolean
    remember?: boolean
  }
  loginData?: HttpData & {
    keyUser?: string
    fetchUser?: boolean
    staySignedIn?: boolean
    remember?: boolean
    cacheUser?: boolean
  }

  logoutData?: HttpData & {
    makeRequest?: boolean
  }
  fetchData?: HttpData & {
    keyUser?: string
    enabled?: boolean
    cache?: boolean
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
      request: AxiosInstance
      invalidToken?: (auth: Auth, response: AxiosResponse) => boolean
    }
    oauth2?: OAuth2Driver
  }
}
```

### rolesKey
