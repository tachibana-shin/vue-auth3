import { computed, ComputedRef, inject } from "vue"

import Auth from "./Auth"
import { authKey } from "./injectionKey"
import Options from "./type/Options"
import AuthDriver, { defineAuthDriver } from "./type/drivers/AuthDriver"
import HttpDriver, { defineHttpDriver } from "./type/drivers/HttpDriver"
import OAuth2Driver, { defineOAuth2Driver } from "./type/drivers/OAuth2Driver"

export function createAuth(options: Options) {
  return new Auth(options)
}
export function useAuth(key: symbol | string = authKey): Auth {
  return inject(key) as Auth
}
// eslint-disable-next-line @typescript-eslint/ban-types
export function useUser<User extends object>(
  key: symbol | string = authKey
): ComputedRef<User | null> {
  const auth = useAuth(key)

  return computed(() => {
    return auth.user()
  })
}

export {
  defineAuthDriver,
  defineHttpDriver,
  defineOAuth2Driver,
}

export type {
  Options,
  Auth,
  AuthDriver,
  HttpDriver,
  OAuth2Driver,
}