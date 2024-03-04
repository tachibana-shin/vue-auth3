The plugin is made to re-use and integrate with existing vue plugins as much as possible.

For this reason it ships with a driver model which includes four driver types.

# Setup

A typical setup might look like the following.

```ts
import { createAuth } from "vue-auth3"
import router from "./router"

import driverAuthBasic from "vue-auth3/drivers/auth/basic"
import driverHttpAxios from "vue-auth3/drivers/http/axios"
// import driverOAuth2FaB from "vue-auth3/driver/oauth2/facebook"
// import driverOAuth2Goo from "vue-auth3/driver/oauth2/google"

const auth = createAuth({
  plugins: {
    router,
  },
  drivers: {
    auth: driverAuthBasic, // required
    http: driverHttpAxios, // required
    // oauth2: {
    // facebook: driverOAuth2FaB,
    // google: driverOAuth2Goo
    // }
  },
})
```

## Auth Drivers

This driver is used to parse a token from a response and format a token for a request.

In it you will find the two functions aptly named `request` and `response`.

For instance, if I take the simplest case of the [basic.ts](https://github.com/tachibana-shin/vue-auth3/blob/master/src/drivers/auth/basic.ts) driver, I can see it's simply setting and returning a token with no other modifications.
:::tip Driver for cross-domain
If your app requires [cross-domain](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) use the `bearer-token` . driver
:::

#### Available Drivers

- [basic.ts](https://github.com/tachibana-shin/vue-auth3/blob/master/src/drivers/auth/basic.ts)
- [bearer.ts](https://github.com/tachibana-shin/vue-auth3/blob/master/src/drivers/auth/bearer.ts)
- [bearer-token.ts](https://github.com/tachibana-shin/vue-auth3/blob/master/src/drivers/auth/bearer-token.ts): Same as bearer.ts but instead of getting token at `headers.Authorization` it will get token at `data.token` suitable for cross-domain
- [devise.ts](https://github.com/tachibana-shin/vue-auth3/blob/master/src/drivers/auth/devise.ts)

## HTTP Drivers

- [axios](https://github.com/tachibana-shin/vue-auth3/blob/master/src/drivers/http/axios.ts)
- [fetch](https://github.com/tachibana-shin/vue-auth3/blob/master/src/drivers/http/fetch.ts)

#### 1\. Make HTTP requests to our API.

No need to add additional code for something that already exists and works fine. So I decided to create an `HTTP Driver for axios` instead of dynamically importing the whole `axios` inside.

::: info Options
It's important to note that all VueAuth3 action functions accept a `options` which, except for a few features of that function, will accept all options of [axios](https://github.com/axiosjs/axios) to send requests.
:::

```ts
// login
auth.$login({
  // ...AxiosRequestConfig
  data: {
    email: "jfoi2323njf@duck.com",
    password: "cmoiu9012A0[]=ee",
  },
})
```

#### 2\. Control requests and responses.

I need a way to make sure our token is sent with each request if set. Likewise I also need to sniff out any new token in the response from our API during login or impersonate requests. Any descent existing plugin should already support this and allow us to easily create these intercepts.

:::info
These intercepts are directly fed into the auth drivers. So for instance a response intercept gets triggered which then calls the `response` auth driver function. Same applies to requests.
:::

:::tip
Although using axios, its only effect is to send requests. I don't inject code in it so you can easily replace it with `fetch`
:::

#### Available Drivers:

- [axios.ts](https://github.com/tachibana-shin/vue-auth3/blob/master/src/drivers/http/axios.ts)
- [fetch](https://github.com/tachibana-shin/vue-auth3/blob/master/src/drivers/http/fetch.ts)

## Router Drivers [Deleted!]

::: danger
Router drivers are no longer needed. Now you just need to add `plugins: { router }`
:::

## OAuth2 Drivers

These drivers are used to make an OAuth2 request to their respective services.

To customize these requires only setting a url and default OAuth2 parameters.

#### Available Drivers:

- [facebook.ts](https://github.com/tachibana-shin/vue-auth3/blob/master/src/drivers/oauth2/facebook.ts)
- [google.ts](https://github.com/tachibana-shin/vue-auth3/blob/master/src/drivers/oauth2/google.ts)

## Custom Drivers

The best way to customize a driver is to simply look at the source code on GitHub of one of the existing ones. From there an existing one can be copied and modified to suit particular needs for the application.

The drivers will heavily integrate with the particular plugin they interact with. For instance if using the `fetch` plugin it will directly affect the `http` and `auth` drivers. For this reason, I will not go into specific details on how to customize each driver.

However if you know typescript you can create a driver easily

- [Auth Driver Types](https://github.com/tachibana-shin/vue-auth3/blob/master/src/type/drivers/AuthDriver.ts)
- [HTTP Driver Types](https://github.com/tachibana-shin/vue-auth3/blob/master/src/type/drivers/HttpDriver.ts)
- [OAuth2 Driver Types](https://github.com/tachibana-shin/vue-auth3/blob/master/src/type/drivers/OAuth2Driver.ts)
