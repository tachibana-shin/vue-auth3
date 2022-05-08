/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
// eslint-disable-next-line @typescript-eslint/ban-types
export function isObject(val: any): val is object {
  if (val !== null && typeof val === "object" && val.constructor !== Array) {
    return true
  }

  return false
}

export function toArray<T = any>(val: T): T[] {
  return typeof val === "string" || typeof val === "number"
    ? [val]
    : (val as any)
}

export function compare<O, T>(one: O, two: T): boolean {
  if (isObject(one) && isObject(two)) {
    for (const key in one) {
      if (compare(one[key], (two as any)[key])) {
        return true
      }
    }

    return false
  }

  const aone = toArray(one)
  const atwo = toArray(two)

  // eslint-disable-next-line functional/no-let
  for (let i = 0, ii = aone.length; i < ii; i++) {
    if (atwo.includes((aone as any)[i])) {
      return true
    }
  }

  return false
}

export function isLocalStorage() {
  try {
    if (!window.localStorage) {
      // eslint-disable-next-line functional/no-throw-statement
      throw "exception"
    }

    localStorage.setItem("storage_test", "1")
    localStorage.removeItem("storage_test")

    return true
  } catch {
    return false
  }
}

export function isSessionStorage() {
  try {
    if (!window.sessionStorage) {
      // eslint-disable-next-line functional/no-throw-statement
      throw "exception"
    }

    sessionStorage.setItem("storage_test", "1")
    sessionStorage.removeItem("storage_test")

    return true
  } catch {
    return false
  }
}

export function isCookieStorage() {
  return true
}

export function getProperty(obj: any, desc: string): any {
  const arr = desc.split(".")

  while (arr.length) {
    // eslint-disable-next-line functional/immutable-data
    obj = obj[arr.shift()!]
  }

  return obj
}
