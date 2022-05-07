import "@vue/runtime-core"
import Auth from "./Auth"

declare module "@vue/runtime-core" {
  // eslint-disable-next-line functional/prefer-type-literal
  interface ComponentCustomProperties {
    // eslint-disable-next-line functional/prefer-readonly-type
    $auth: Auth
  }
}

