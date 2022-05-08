import "vue-router"
import Roles from "./type/Roles"

declare module "vue-router" {
  // eslint-disable-next-line functional/prefer-type-literal
  interface RouteMeta {
    auth?:
      | boolean
      | string
      | Roles[]
      | {
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
  }
}
