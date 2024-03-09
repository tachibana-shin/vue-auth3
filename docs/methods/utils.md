## remember

```ts
auth.remember(data?: any | null) => any | null
```

Returns the "remember" data or `null` if not set.

This can also manually set the remember data which is automatically used by the `login`, `register` and `oauth2` methods when using the `remember` option.

Intended use is to set some data such as a name for when a user returns the page and is logged out. For example we may want to show "Welcome back, Rob" if the remember data is set.

> This must set a string and should use `JSON.stringify` and `JSON.parse` if using objects.

#### Examples

```vue
<template>
  <div>
    <div v-if="$auth.remember()">Welcome back, {{ $auth.remember() }}</div>
  </div>
</template>

<script lang="ts" setup>
const auth = useAuth()

function remember() {
  auth.remember("Rob")
}
</script>
```

#### References

- [rememberKey Option](/options/core#rememberkey)

## unremember

```ts
auth.unremember() => void
```

Clear out the remember data.

#### Examples

```vue
<script lang="ts" setup>
const auth = useAuth()

function unremember() {
  auth.unremember()
}
</script>
```

## redirect

```ts
auth.redirect() => {
    type: number | null
    from: RouteLocationNormalized | null
    to: RouteLocationNormalized | null
  } | null
```

Returns redirect caused by the vue-auth plugin.

This includes a status code to indicate what caused the redirect. This is useful for cases where a login redirect has occurred or even for debugging.

#### Examples

```vue
<script lang="ts" setup>
const auth = useAuth()

function login() {
  const redirect = auth.redirect();

  auth
    .login({
      ...
      redirect: {
        name: redirect ? redirect.from.name : 'user-account'
      }
    });
}
</script>
```

## refresh

```ts
auth.refresh(options: AxiosRequestConfig & Options["refreshToken"]) => Promise<Options["refreshToken"]>
```

Execute a refresh request.

This is used for refreshing the user token. Use the `fetch()` method to re-fetch the actual user data instead.

#### Examples

```vue
<script lang="ts" setup>
const auth = useAuth()

function refresh() {
  auth.refresh()
}
</script>
```

#### References

- [Requests Guide](/guide/requests)
- [refreshToken Option](/options/core#refreshToken)

## token

```ts
auth.token(setToken?: string | null) => string | null
```

Returns the token data or `null` if not set.

Can also be used to manually set a token.

If the `name` parameter is not specified it will use the default. The `token` parameter is used if setting rather than fetching a token. The optional `expires` parameter specifies whether token should remain after the browser is closed or not.

> The token is automatically stored when logging in with the `staySignedIn` option mapping directly to the `expires` parameter.

#### Examples

```vue
<script lang="ts" setup>
const auth = useAuth()

const token = computed<string | null>({
  get() {
    return auth.token()
  },
  set() {
    auth.token(null, "MY-TOKEN_CODE", false)
  },
})
</script>
```

#### References

- [Tokens Guide](/guide/token)
- [tokenDefaultKey Option](/options/core#tokendefaultkey)
- [tokenImpersonateKey Option](/options/core#tokenimpersonatekey)
- [stores Option](/options/core#stores)

## disableImpersonate

```ts
auth.disableImpersonate() => boolean;
```

Disables impersonating mode.

Used to temporary disable impersonating mode in case we need to fire a request withe the "admin" user while impersonating.

#### Examples

```vue
<script lang="ts" setup>
const auth = useAuth()

function fetch() {
  auth.disableImpersonate()

  // run as admin

  auth.enableImpersonate()
}
</script>
```

## enableImpersonate

```ts
auth.enableImpersonate() => boolean;
```

Enables impersonating mode.

Used to re-enable impersonating mode if previously disabled.

#### Examples

```vue
<script lang="ts" setup>
const auth = useAuth()

function fetch() {
  auth.disableImpersonate()

  // run as admin

  auth.enableImpersonate()
}
</script>
```
