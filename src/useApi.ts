import { inject } from "vue"

import Auth from "./Auth"
import { authKey } from "./injectionSymbols"

export function useAuth(key: symbol | string = authKey): Auth {
  return inject(key) as Auth
}

