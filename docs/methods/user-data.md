## user

```ts
auth.user(setUserData?: any | null) => any | null
```

Returns the user object or `null` if not yet set.

This can also be used to manually set the user data by passing in an object.

#### Examples

```vue
<script lang="ts" setup>
const auth = useAuth()

const user = computed<{
  first_name: string
  last_name: string
} | null>(() => {
  return auth.user() || {}
})

function update() {
  auth.user({
    first_name: "Rob",
    last_name: "Nova",
  })
}
</script>
```

#### References

## fetch

```ts
auth.fetch(options: AxiosRequestConfig & Options["fetchData"]) => Promise<AxiosResponse>
```

Execute a fetch request.

Manually fetches the user data. Sometimes useful to pull a fresh set of user data.

#### Examples

```vue
<script lang="ts" setup>
const auth = useAuth()

function fetch() {
  auth.fetch()
}
</script>
```

#### References

- [Requests Guide](/guide/requests)
- [refreshToken Option](/options/core#refreshToken)
