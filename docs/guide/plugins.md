Plugins are required for VueAuth3 to manage your application

# Setup

A typical setup might look like the following.

```ts
import { createAuth } from "vue-auth3"
import router from "./router"

const auth = createAuth({
  plugins: {
    router,
  },
})
```

## Router Plugin

You must install this plugin so that VueAuth3 can redirect pages in your application. If you do not install this plugin VueAuth3 will understand that you do not need to redirect routers when problems arise
