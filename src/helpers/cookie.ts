import CookieOptions from "../type/CookieOptions";

function setCookie(
  key: string,
  value: string,
  expires: boolean,
  auth: Auth
): void {
  const options = auth.options.cookie;

  let cookie = `${key}=${value};`;

  for (const prop in options) {
    let value =
      typeof options[prop] === "function" ? options[prop]() : options[prop];

    // Just skip if unset or false.
    if (value === false || value === void 0) {
      continue;
    }

    if (prop === "expires") {
      value = expires ? "" : getDate(prop);
    }

    if (value === true) {
      cookie += `${prop}`;
      continue;
    }

    // Default key/val.

    cookie += `${prop}=${value};`;
  }

  document.cookie = cookie;
}

function getDate(val: string | number | Date): string {
  if (typeof val === "string") {
    return val as string;
  }

  return new Date(
    new Date().getTime() +
      (val instanceof Date ? val.getTime() : (val as number))
  ).toUTCString();
}

function get(key: string): string | null {
  return (
    document.cookie
      .replace(/;\s+/g, ";")
      .split(";")
      .map((s) => {
        return s.replace(/\s+=\s+/g, "=").split("=");
      })
      .find(([keyTest]) => {
        return keyTest === key;
      })?.[1] ?? null
  );
}

function remove(key: string, auth: Auth): void {
  setCookie(key, "", false, auth);
}

const cookie = {
  get,
  set: setCookie,
  remove,
};

export default cookie;
