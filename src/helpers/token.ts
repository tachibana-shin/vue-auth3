import Auth from "../Auth"
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

function get(auth: Auth, key: string | null) {
  // eslint-disable-next-line functional/no-let
  for (let i = 0; i < auth.options.stores.length; i++) {
    const store = auth.options.stores[i]
    const keyI = getTokenKey(key, auth)

    if (typeof store === "object") {
      return store.get(keyI)
    }
    if (store === "storage" && isLocalStorage() && isSessionStorage()) {
      return storage.get(keyI)
    }
    if (store === "cookie" && isCookieStorage()) {
      return cookie.get(auth, keyI)
    }
  }

  return null
}

function set(auth: Auth, key: string | null, token: string, expires: boolean) {
  // eslint-disable-next-line functional/no-let
  for (let i = 0; i < auth.options.stores.length; i++) {
    const store = auth.options.stores[i]
    const keyI = getTokenKey(key, auth)

    if (typeof store === "object") {
      return store.set(keyI, token, expires, auth)
    }
    if (store === "storage" && isLocalStorage() && isSessionStorage()) {
      return storage.set(keyI, token, expires)
    }
    if (store === "cookie" && isCookieStorage()) {
      return cookie.set(auth, keyI, token, expires)
    }
  }
}

function remove(auth: Auth, key: string | null) {
  // eslint-disable-next-line functional/no-let
  for (let i = 0; i < auth.options.stores.length; i++) {
    const store = auth.options.stores[i]
    const keyI = getTokenKey(key, auth)

    if (typeof store === "object") {
      return store.remove(keyI)
    }
    if (store === "storage" && isLocalStorage() && isSessionStorage()) {
      return storage.remove(keyI)
    }
    if (store === "cookie" && isCookieStorage()) {
      return cookie.remove(auth, keyI)
    }
  }
}

const token = {
  get,
  set,
  remove,
}

export default token
