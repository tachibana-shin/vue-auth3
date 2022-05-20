## ready

```ts
auth.ready() => boolean
```

Returns the current auth loading state.

Check for a valid token, then wait for any refresh and/or user fetch if enabled before being set to `true`.

#### Examples

```vue
<template>
  <div>
    <span v-show="!auth.ready()"> Loading... </span>

    <span v-show="auth.ready()"> Ready! </span>
  </div>
</template>
```

## load

```ts
auth.load() => Promise<AxiosResponse>
```

This works similar to the `ready()` method except it returns a `Promise` which can be used for further processing.

> Multiple Promise `.load().then()` chains can be created.

#### Examples

```vue
<script lang="ts" setup>
const auth = useAuth()

auth()
  .load()
  .then(() => {
    if (auth.check()) {
      // fetch some data
    }
  })
</script>
```

## check

```ts
auth.check(role: Roles) => boolean;
```

Check to see if a user is logged in.

It accepts a `role` parameter to check for specific role access. The additional `key` parameter is to specify the roles field to check against on the user object if different from the default one set in `options.rolesKey`.

> The optional `key` string parameter supports dot notation to access a nested role key.

---

> There are four main types of checks available:
>
> - "array of strings" to "array of strings"
> - "array of strings" to "string"
> - "string" to "string"
> - "object" to "object"

---

> There is NO array of objects comparison available.

#### Examples

```vue
<template>
  <div>
    <a v-if="!$auth.check()"> login </a>

    <a v-if="$auth.check('admin')"> admin </a>

    <a v-if="$auth.check(['admin', 'manager'])"> manage </a>

    <a v-if="$auth.check('admin', 'nested.key')"> nested </a>
  </div>
</template>
```

General `String` and `Array` comparisons.

```ts
auth.user()

// {id: 1, email: 'admin@example.com', roles: 'admin'}

auth.check("admin") // true
this.$auth.check("user") // false
this.$auth.check(["admin", "user"]) // true
this.$auth.check("admin", "blah") // false
```

The check can also do `Object` to `Object` comparisons.

```ts
this.$auth.user()

// {id: 1, email: 'admin@example.com', roles: {team: 'view', boards: ['view', 'edit']}}

this.$auth.check({ team: "edit" }) // false
this.$auth.check({ team: "view" }) // true
this.$auth.check({ boards: "edit" }) // true
this.$auth.check({ boards: ["edit", "view"] }) // true
```

#### References

- [Auth Meta Guide](/guide/auth-meta)
- [rolesKey Option](/options/core#roleskey)
