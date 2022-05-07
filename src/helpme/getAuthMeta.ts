import { RouteLocationNormalized } from "vue-router"

export default function getAuthMeta({ matched }: RouteLocationNormalized) {
  // eslint-disable-next-line functional/no-let
  let auth
  const authRoutes = matched.filter(({ meta }) =>
    Object.prototype.hasOwnProperty.call(meta, "auth")
  )

  // matches the nested route, the last one in the list
  if (authRoutes.length) {
    auth = authRoutes[authRoutes.length - 1].meta.auth
  }

  return auth ?? null
}

