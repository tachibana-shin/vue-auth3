import "vue-router"
import Roles from "./type/Roles"

declare module "vue-router" {
  // eslint-disable-next-line functional/prefer-type-literal
  interface RouteMeta {
    // eslint-disable-next-line functional/prefer-readonly-type
    auth?:
      | boolean
      | string
      // eslint-disable-next-line functional/prefer-readonly-type
      | Roles[]
      | {
          // eslint-disable-next-line functional/prefer-readonly-type
          roles?: Roles
          // eslint-disable-next-line functional/prefer-readonly-type
          redirect?:
            | RouteLocationRaw
            | ((to: RouteLocationNormalized) => RouteLocationRaw)
          // eslint-disable-next-line functional/prefer-readonly-type
          notFoundRedirect?:
            | RouteLocationRaw
            | ((to: RouteLocationNormalized) => RouteLocationRaw)
          // eslint-disable-next-line functional/prefer-readonly-type
          forbiddenRedirect?:
            | RouteLocationRaw
            | ((to: RouteLocationNormalized) => RouteLocationRaw)
          // eslint-disable-next-line functional/prefer-readonly-type
          rolesKey?: string
        }
  }
}
