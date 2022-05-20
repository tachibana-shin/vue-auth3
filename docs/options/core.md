# Overview

```ts
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
    cacheUser?: boolean
  }

  logoutData?: HttpData & {
    makeRequest?: boolean
  }
  fetchData?: HttpData & {
    enabled?: boolean
    cache?: boolean
    enabledInBackground?: boolean
  }
  refreshToken?: Omit<HttpData, "redirect"> & {
    enabled?: boolean
    enabledInBackground?: boolean
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
    oauth2?: {
      facebook?: OAuth2Driver
      google?: OAuth2Driver
    }
  }
}
```

The set of core options.

## rolesKey

```ts
 @typeof string
 @default 'roles'
```

The default field to check against on the user object when using "auth meta" or `$auth.check()`.

> The key also supports dot notation as in "my.role.key".

#### References

- [Auth Meta Guide](/guide/auth-meta)
- [check() Method](/methods/init#check)

## rememberKey

```ts
 @typeof string
 @default 'auth_remember'
```

The name under which the remember `string` is stored under.

#### References

- [remember() Method](/methods/utils#remember)

## staySignedInKey

```ts
 @typeof string
 @default 'auth_stay_signed_in'
```

The name under which the staySignedIn option from login is stored.

#### References

- [login() Method](/methods/register-and-login#login)

## tokenDefaultKey

```ts
 @typeof string
 @default 'auth_token_default'
```

The name under which the default token `String` is stored under.

#### References

- [Token Guide](/guide/token)

## tokenImpersonateKey

```ts
 @typeof string
 @default 'auth_token_impersonate'
```

The name under which the impersonate token `String` is stored under.

#### References

- [Token Guide](/guide/token)

## stores

```ts
 @typeof ("storage" | "cookie" | {
    get: (key: string) => any;
    set: (key: string, val: any, expires?: boolean) => void;
    remove: (key: string) => void;
 })[]
 @default ['storage', 'cookie']
```

The order in which to attempt storage of "token" and "remember" `String` data.

#### References

- [Token Guide](/guide/token)

## cookie

```ts
 @typeof {
    path?: string;
    domain?: string | number;
    secure?: boolean;
    expires?: number;
    sameSite?: string;
 }
 @default  {
    path: "/",
    domain: void 0,
    secure: true,
    expires: 12096e5,
    sameSite: "None",
  }
```

The default params that will be set on cookies when cookie storage is enabled.

#### References

- [Cookie Guide](/guide/cookie)

## authRedirect

```ts
 @typeof RouteLocationRaw;
 @default {
    path: "/login"
 }
```

The router redirect to use if any authentication is required on a route.

This will trigger if `meta.auth` is set to anything other than `undefined` or `false`.

> This also accepts a callback function which passes the transition for dynamic handling.

#### References

- [Auth Meta Guide](/guide/auth-meta)
- [check() Method](/methods/init#check)

## forbiddenRedirect

```ts
 @typeof RouteLocationRaw;
 @default {
    path: "/403"
 }
```

The router redirect to use if a route is forbidden.

This will trigger if the user object's role property does not match up with the auth value.

> This also accepts a callback function which passes the transition for dynamic handling.

#### References

- [Auth Meta Guide](/guide/auth-meta)

## notFoundRedirect

```ts
 @typeof RouteLocationRaw;
 @default {
    path: "/404"
 }
```

The router redirect to use if route is "not found".

Typically used to hide pages while logged in. For instance we don't want the user to access a login or register page while they are authenticated. Hence a "404 Not Found".

This will trigger if `auth.meta` is set to false and the user is already authenticated.

> This also accepts a callback function which passes the transition for dynamic handling.

#### References

- [Auth Meta Guide](/guide/auth-meta)

## registerData

```ts
 @typeof  AxiosRequestConfig & {
  redirect?: RouteLocationRaw
    autoLogin?: boolean
    fetchUser?: boolean
    staySignedIn?: boolean
    remember?: boolean
  };
 @default {
    url: "auth/register",
    method: "POST",
    redirect: "/login",
    autoLogin: false,
  }
```

Default register request data.

> If the `autoLogin` is enabled it will subsequently trigger a login call. All options available to the login method will also be available here.

#### References

- [Requests Guide](/guide/requests)
- [register() Method](/methods/register-and-login#register)
- [redirect Option](/options/options-generate#redirect)

### autoLogin

```ts
@typeof boolean;
```

Specify when the user should be auto logged in.

Used in register method.

### staySignedIn

```ts
@typeof boolean;
```

Specify whether the token data stored will be long lived or not.

Meaning does it expire after the browser is closed or not.

## loginData

```ts
 @typeof  AxiosRequestConfig & {
  redirect?: RouteLocationRaw
    fetchUser?: boolean
    staySignedIn?: boolean
    remember?: boolean
    cacheUser?: boolean
  }
 @default{
    url: "auth/login",
    method: "POST",
    redirect: "/",
    fetchUser: true,
    staySignedIn: true,
  }
```

Default login request data.

#### References

- [Requests Guide](/guide/requests)
- [login() Method](/methods/register-and-login#login)
- [redirect Option](/options/options-generate#redirect)
- [fetchUser Option](/options/options-generate#fetchuser)
- [staySignedIn Option](/options/options-generate#staysignedin)

## logoutData

```ts
 @typeof  AxiosRequestConfig & {
  redirect?: RouteLocationRaw
    makeRequest?: boolean
  }
 @default {
    url: "auth/logout",
    method: "POST",
    redirect: "/",
    makeRequest: false,
  },
```

Default logout request data.

#### References

- [Requests Guide](/guide/requests)
- [logout() Method](/methods/register-and-login#logout)
- [redirect Option](/options/options-generate#redirect)
- [makeRequest Option](/options/options-generate#makerequest)

## oauth2Data

```ts
 @typeof  AxiosRequestConfig & {
  redirect?: RouteLocationRaw
    fetchUser?: true
  }
 @default {
    url: "auth/social",
    method: "POST",
    redirect: "/",
    fetchUser: true,
  },
```

Default oauth2 request data.

> After a token is received and the API request is made this will execute via the login method. All options available to the login method will also be available here.

#### References

- [OAuth2 Guide](/guide/oauth2)
- [Requests Guide](/guide/requests)
- [oauth2() Method](/methods/register-and-login#oauth2)
- [redirect Option](/options/options-generate#redirect)
- [fetchUser Option](/options/options-generate#fetchuser)

```ts
 @typeof  AxiosRequestConfig & {
  redirect?: RouteLocationRaw
    enabled?: boolean
    cache?: boolean
    enabledInBackground?: boolean
  }
 @default{
    url: "auth/user",
    method: "GET",
    enabled: true,
  },
```

Default fetch request data.

#### References

- [Requests Guide](/guide/requests)
- [fetch() Method](/methods/user-data#fetch)
- [enabled Option](/options/options-generate#enabled)
- [enabledInBackground Option](/options/options-generate#enabledInBackground)

## refreshToken

```ts
 @typeof AxiosRequestConfig & {
    enabled?: boolean
    enabledInBackground?: boolean
    interval?: number | false
  }
 @default{
    url: "auth/refresh",
    method: "GET",
    enabled: true,
    interval: 30,
  },
```

Default refresh request data.

#### References

- [Requests Guide](/guide/requests)
- [refresh() Method](/methods/utils#refresh)
- [enabledInBackground Option](/options/options-generate#enabledInBackground)

### interval

```ts
@typeof number;
```

Specity interval length for a feature.

This is used primarily to keep token alive while a user is active on the app.

## impersonateData

```ts
 @typeof  AxiosRequestConfig & {
  redirect?: RouteLocationRaw
    fetchUser?: boolean
    cacheUser?: boolean
  }
 @default {
    url: "auth/impersonate",
    method: "POST",
    redirect: "/",
    fetchUser: true,
  },
```

Default impersonate request data.

#### References

- [Requests Guide](/guide/requests)
- [impersonate() Method](/methods/impersonating#impersonate)
- [fetchUser Option](/options/options-generate#fetchuser)

## unimpersonateData

```ts
 @typeof  AxiosRequestConfig & {
  redirect?: RouteLocationRaw
    fetchUser?: boolean
    makeRequest?: boolean
    cacheUser?: boolean
  }
 @default {
    url: "auth/unimpersonate",
    method: "POST",
    redirect: "/admin",
    fetchUser: true,
    makeRequest: false,
  },
```

Default unimpersonate request data.

#### References

- [Requests Guide](/guide/requests)
- [unimpersonate() Method](/methods/impersonating#unimpersonate)
- [redirect Option](/options/options-generate#redirect)
- [fetchUser Option](/options/options-generate#fetchuser)
- [makeRequest Option](/options/options-generate#makerequest)
