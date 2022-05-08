function set<T>(key: string, value: T, expires: boolean): void {
  const $ = JSON.stringify(value)

  if (expires) {
    sessionStorage.setItem(key, $)
    return
  }

  localStorage.setItem(key, $)
}

function get<T>(key: string): T | null {
  const $ = sessionStorage.getItem(key) || localStorage.getItem(key)

  if ($ === null) {
    return null
  }

  return JSON.parse($)
}

function remove(key: string): void {
  localStorage.removeItem(key)
  sessionStorage.removeItem(key)
}

const storage = {
  get,
  set,
  remove,
}

export default storage
