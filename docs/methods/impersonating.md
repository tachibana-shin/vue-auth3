## impersonate

```ts
data.impersonate(data?: any) => any;
```

Execute an impersonate request.

This will likely require the id of the user to impersonate to somehow to be passed to the API.

#### Examples

```vue
<script lang="ts" setup>
const auth = useAuth()
auth.impersonate({
  url: "auth/" + user.id + "/impersonate",
  redirect: { name: "user-account" },
})
</script>
```

#### References

- [Requests Guide](/guide/requests)
- [impersonateData Option](/options/core#impersonatedata)

## unimpersonate

```ts
auth.unimpersonate(data: Options["unimpersonate"]) => Promise<AxiosResponse>
```

Execute an unimpersonate request.

Clears out the impersonating token and restores previously used token.

> This does not store multiple data sets, it only stores the tokens.

#### Examples

```vue
<script lang="ts" setup>
const auth = useAuth()
function unimpersonate(user) {
  auth.unimpersonate({
    makeRequest: true,
    redirect: { name: "admin-users" },
  })
}
</script>
```

#### References

- [Requests Guide](/guide/requests)
- [unimpersonateData Option](/options/core#unimpersonatedata)

### impersonating

```ts
auth.impersonating() => boolean
```

Check to see if in impersonating mode.

#### Examples

```vue
<template>
  <div>
    <a v-if="$auth.impersonating()"> Unimpersonate </a>
  </div>
</template>
```
