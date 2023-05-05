import Auth from "../Auth"
import Options from "../type/Options"
import { isCookieStorage, isLocalStorage, isSessionStorage } from "../utils"

import cookie from "./cookie"
import storage from "./storage"

function getTokenKey(key: string | null, auth: Auth): string {
  key = key || auth.currentToken

  if (key) {
    return key
  }

  if (auth.impersonating()) {
    return auth.options.tokenImpersonateKey
  }

  return auth.options.tokenDefaultKey
}

function get<T>(auth: Auth, key: string | null): T | null {
  const keyI = getTokenKey(key, auth)

  // eslint-disable-next-line functional/no-let
  for (let i = 0; i < auth.options.stores.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const store = (auth.options as unknown as Options).stores![i]
    // eslint-disable-next-line functional/no-let
    let val

    if (typeof store === "object") {
      val = store.get(keyI)
    }
    if (store === "storage" && isLocalStorage() && isSessionStorage()) {
      val = storage.get(keyI)
    }
    if (store === "cookie" && isCookieStorage()) {
      val = cookie.get(auth, keyI)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (val !== void 0) return val as any
  }

  return null
}

function set<T>(
  auth: Auth,
  key: string | null,
  value: T,
  expires: boolean
): void {
  const keyI = getTokenKey(key, auth)
  // eslint-disable-next-line functional/no-let
  for (let i = 0; i < auth.options.stores.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const store = (auth.options as unknown as Options).stores![i]

    if (typeof store === "object") {
      store.set(keyI, value, expires, auth)
    }
    if (store === "storage" && isLocalStorage() && isSessionStorage()) {
      storage.set(keyI, value, expires)
    }
    if (store === "cookie" && isCookieStorage()) {
      cookie.set(auth, keyI, value, expires)
    }
  }
}

function remove(auth: Auth, key: string | null) {
  // eslint-disable-next-line functional/no-let
  for (let i = 0; i < auth.options.stores.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const store = (auth.options as unknown as Options).stores![i]
    const keyI = getTokenKey(key, auth)

    if (typeof store === "object") {
      store.remove(keyI)
    }
    if (store === "storage" && isLocalStorage() && isSessionStorage()) {
      storage.remove(keyI)
    }
    if (store === "cookie" && isCookieStorage()) {
      cookie.remove(auth, keyI)
    }
  }
}

const token = {
  get,
  set,
  remove,
}

export default token
