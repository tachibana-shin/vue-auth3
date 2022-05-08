import Auth from "../Auth"

function setCookie<T>(
  auth: Auth,
  key: string,
  value: T,
  expires: boolean
): void {
  const options = auth.options.cookie

  // eslint-disable-next-line functional/no-let
  let cookie = `${key}=${JSON.stringify(value)};`

  for (const [prop, val] of Object.entries(options)) {
    // eslint-disable-next-line functional/no-let
    let value = typeof val === "function" ? val() : val

    // Just skip if unset or false.
    if (value === false || value == null) {
      continue
    }

    if (prop === "expires") {
      value = expires ? "" : getDate(prop)
    }

    if (value === true) {
      cookie += `${prop};`
      continue
    }

    // Default key/val.

    cookie += `${prop}=${value};`
  }

  // eslint-disable-next-line functional/immutable-data
  document.cookie = cookie
}

function getDate(val: string | number | Date): string {
  if (typeof val === "string") {
    return val as string
  }

  return new Date(
    new Date().getTime() +
      (val instanceof Date ? val.getTime() : (val as number))
  ).toUTCString()
}

function get(auth: Auth, key: string): string | null {
  return JSON.parse(
    document.cookie
      .replace(/;\s+/g, ";")
      .split(";")
      .map((s) => {
        return s.replace(/\s+=\s+/g, "=").split("=")
      })
      .find(([keyTest]) => {
        return keyTest === key
        // eslint-disable-next-line quotes
      })?.[1] ?? '"null"'
  )
}

function remove(auth: Auth, key: string): void {
  setCookie(auth, key, "", false)
}

const cookie = {
  get,
  set: setCookie,
  remove,
}

export default cookie
