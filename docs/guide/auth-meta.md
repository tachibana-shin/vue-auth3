:::info Requireed
To use this feature you need to [install the router plugin](/guide/plugins.html#router-plugin)
:::

First thing to point out is that the `auth.check()` method and the `meta.auth` checks use the exact same compare logic when doing their respective checks. However, we'll see that the `meta.auth` checks also have some specific route redirect logic based on the value set.

> This guide assumes we are using the defacto `vue-router` plugin.

> It's very important to note that these are just front end restrictions for some surface level route redirect logic. Any kind of access to API data should have proper restrictions and authentication in place on the API itself.

## Setting Auth On a Route

To set the auth on a route set the `meta.auth` property.

```ts
import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      component: () => import("src/pages/Login.vue"),
      meta: {
        auth: false,
      },
    },
    {
      path: "/my-account",
      component: () => import("src/pages/MyAccount.vue"),
      meta: {
        auth: true,
      },
    },
  ],
})
```

This value can be set on a child or parent. If not present on the child it will use the immediate parents values if set. Otherwise it will keep going up to the next (grand) parent if available.

```ts
import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
    history: createWebHistory(),
    routes: [{
        path: '/user',
        component: ...,
        meta: {
            auth: true
        },
        children: [{
            path: 'account'
            component: ...
            ...
        }]
    }]
})
```

## Meta Values

There are a few different values that can be set here. It's useful to review the [check() Method](/methods/init#check) beforehand as the same comparison logic is used. However, note that the check method performs no redirects, it only returns a `true` or `false` value.

Below I'll cover all the different values that can be set on a route.

> I'll cover redirects in more detail further below.

### auth: `undefined`

Public, no checks required.

In this case the route is always available whether the user is authenticated or not.

### auth: `true`

The route requires an authenticated user. No other comparison for roles are made here.

If this check fails it will fire off the `authRedirect` which by default redirects to the `/login` path.

### auth: `false`

The route requires an un-authenticated user.

If the user is authenticated and tries to access this route the check will fail. In this case the `notFoundRedirect` will fire off and by default redirect to the `/404` path.

### auth: `Roles[]`

The route requires authentication and will do an additional role check.

If this check fails it is now a specific case of "forbidden" access. The user is authenticated but does not have the necessary role or privileges for this route.

How the comparisons are made is already covered in the [auth.check()](/methods/init#check) section which can be reviewed there.

### auth: `Options["auth"]`

```ts
type Options = {
  roles?: Roles
  redirect?:
    | RouteLocationRaw
    | ((to: RouteLocationNormalized) => RouteLocationRaw)
  notFoundRedirect?:
    | RouteLocationRaw
    | ((to: RouteLocationNormalized) => RouteLocationRaw)
  forbiddenRedirect?:
    | RouteLocationRaw
    | ((to: RouteLocationNormalized) => RouteLocationRaw)
  rolesKey?: string
}
```

the options here have higher precedence than [Options](/options/core)

## Advanced Redirects

The [Options](/options/core) section highlights the different default redirect options which can be set. However, each individual route can also define it's own specific redirect.

To set the `redirect` field the format of the `auth` parameter in the routes must change to the format below.

```ts
    auth: {
        roles: 'admin',
        redirect: '/admin/login'
    }
```

In this case `roles` will follow the same rules as `auth` would and `redirect` will follow the same logic of the route provider.

There is also a `forbiddenRedirect` field that can be set for situations where a user is logged in but the role check fails. Additionally the `notFoundRedirect` for not found cases.

```ts
    auth: {
        roles: 'admin',
        redirect: '/admin/login',
        notFoundRedirect: {name: 'error-404'},
        forbiddenRedirect: '/admin/403'
    }
```

The custom route redirects can also set a function for dynamic handling.

```ts
    auth: {
        roles: 'admin',
        redirect: '/admin/login',
        notFoundRedirect: {name: 'error-404'},
        forbiddenRedirect (transition) {
            return '/admin/403';
        }
    }
```

### References

- [check() Method](/methods/init#check)
- [authRedirect Option](/options/core#authredirect)
- [forbiddenRedirect Option](/options/core#forbiddenredirect)
- [notFoundRedirect Option](/options/core#notfoundredirect)
