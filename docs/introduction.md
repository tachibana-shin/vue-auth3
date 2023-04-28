---
sidebarDepth: 2
---

# What is Vue Auth 3?

Vue Auth 3 is a plugin that manages all [Vue 3](https://vuejs.org) authentical related things except `api`. This plugin inherits the most core features of [@websanova/vue-auth](https://npmjs.org/package/@websanova/vue-auth) and redeploy it in vue 3's `composition/api` along with [axios](https://npmjs.org/package/axios)

It's purpose is to simplify common authentication tasks using shorthand methods such as `auth.login()` and `auth.register()` with the rest happening under the hood.

It's important to note that this is a front end plugin that for the most part only facilitates authentication token transfer between the client and API. The actual authentication mechanisms will therefore be determined by the API with it's associated security concerns.

## Why vue-auth3 was born when there was already [@websanova/vue-auth](https://npmjs.org/package/@websanova/vue-auth)?

[@websanova/vue-auth](https://npmjs.org/package/@websanova/vue-auth) is a great plugin that works great in Vue 2 but when I upgraded to `composition/api` its APIs and options became confusing and proved inefficient + memory consuming and especially the timeout to display the page is too long.

So `vue-auth 3` was born to overcome these problems and fully support TypeScript.

```ts
import { createAuth } from "vue-auth3"
import axios from "axios"
import driverAuthBearer from "vue-auth3/drivers/auth/bearer"

const auth = createAuth({
  fetchData: {
    enabled: true, // send a request to `/api/user` if the user information stored in the cookie is not visible
    cache: true, //save user information to localStorage for use
    enabledInBackground: true, // refresh user information in the background
  },
  refreshToken: {
    enabled: false, // refresh token in goto page
    enabledInBackground: true, // refresh token in background
  },
  drivers: {
    http: {
      request: axios,
    },
    auth: driverAuthBearer,
  },
})
```
