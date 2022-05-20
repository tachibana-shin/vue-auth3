# Getting started

:::tip NOTE
We will be using [ES6](https://github.com/lukehoban/es6features) in the code samples in the guide.

Also, all examples will be using the full version of Vue to make on-the-fly template compilation possible. See more details [here](https://v3.vuejs.org/guide/installation.html#runtime-compiler-vs-runtime-only).
:::

:::warning `$auth`
ince the following pages of instructions I will use `composition/api`. `$auth` is still backward compatible from [@websanova/vue-auth](https://npmjs.org/package/@websanova/vue-auth) but it is deprecated
:::

Creating a global application with Vue + Vue I18n is very simple. With Vue.js, we composed our app with components. When we add Vue I18n to the mix, all we need to do is get resource notification ready and simply use the auth API provided by vue-auth3.

Here’s a basic example:

## Vue

```vue
<template>
  <p v-if="$auth.check()">
    {{ $auth.user() }}
  </p>
  <p v-else>You have not login!</p>
</template>
```

`composition/api`:

```vue
<template>
  <p v-if="auth.check()">
    {{ auth.user() }}
  </p>
  <p v-else>You have not login!</p>
</template>
<script lang="ts" setup>
import { useAuth } from "vue-auth3"

const auth = useAuth()
</script>
```

When a user is authenticated the app will likely need to do some initial preload and checks.

For instance if we refresh the app in authenticated mode, we'll need to first check tokens and fetch some data.

A special `$auth.ready()` Method has been created for this specific case.

## TypeScript

```ts
import { createApp } from "vue"
import router from "./router"
import { createAuth } from "vue-router"

import driverAuthBasic from "vue-auth3/dist/drivers/auth/basic"
import driverHttpAxios from "vue-auth3/dist/drivers/http/axios"

const auth = createAuth({
  plugins: {
    router,
  },
  drivers: {
    auth: driverAuthBasic,
    http: driverHttpAxios,
  },
})

createAuth().use(router).use(auth).mount("#app")
```

By calling `app.use(auth)`, By default, we can access the VueAuth3 instance from each component with `this.$auth`, which can be referenced from the `global` property of i18n instance that created with `createAuth`. As well as, auth API such as `this.$auth` is also injected into each component, so these API can be used with templates.

To use similar ways at the `setup` function, you need to call the `useAuth` functions. We will learn more about this in the [Composition API](https://v3.vuejs.org/guide/composition-api-introduction.html)

Throughout the docs, we’ll use APIs like `this.$auth`, which are almost keep backward compatible from [@websanova/vue-auth](https://npmjs.org/package/@websanova/vue-auth).

The following sections will be explained using the Legacy API mode.
