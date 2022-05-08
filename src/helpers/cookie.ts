import Auth from "../Auth"

function setCookie(
  auth: Auth,
  key: string,
  value: string,
  expires: boolean
): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options = auth.options.cookie as any

  // eslint-disable-next-line functional/no-let
  let cookie = `${key}=${value};`

  for (const prop in options) {
    // eslint-disable-next-line functional/no-let
    let value =
      typeof options[prop] === "function" ? options[prop]() : options[prop]

    // Just skip if unset or false.
    if (value === false || value === void 0) {
      continue
    }

    if (prop === "expires") {
      value = expires ? "" : getDate(prop)
    }

    if (value === true) {
      cookie += `${prop}`
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
  return (
    document.cookie
      .replace(/;\s+/g, ";")
      .split(";")
      .map((s) => {
        return s.replace(/\s+=\s+/g, "=").split("=")
      })
      .find(([keyTest]) => {
        return keyTest === key
      })?.[1] ?? null
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
