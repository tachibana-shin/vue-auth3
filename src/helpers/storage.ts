function set(key: string, value: string, expires: boolean): void {
  if (expires) {
    sessionStorage.setItem(key, value)
    return
  }

  localStorage.setItem(key, value)
}

function get(key: string): string | null {
  return sessionStorage.getItem(key) || localStorage.getItem(key)
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
