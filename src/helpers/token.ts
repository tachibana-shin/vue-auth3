import cookie from "./cookie";
import storage from "./storage";

function getTokenKey(key : string | null, auth: Auth): string {
  key = key || auth.currentToken;

  if (key) {
    return key;
  }

  if (auth.impersonating()) {
    return auth.options.tokenImpersonateKey;
  }

  return auth.options.tokenDefaultKey;
}

function processToken(action: "get", key: string | null, auth: Auth): string | null;
function processToken(action: "remove", key: string | null): void;
function processToken(
  action: "set",
  key: string | null,
  token: string,
  expires: boolean,
  auth: Auth
): void;

function processToken(
  action: "set" | "get" | "remove",
  key: string | null,
  token?: string,
  expires?: boolean,
  auth?: Auth
): string | null {
  const args: any[] = [getTokenKey(key, auth)];

  if (action === "set") {
    args.push(token);
    args.push(expires === true);
  }

  for (let i = 0, len = auth.options.stores.length; i < len; i++) {
    const store = auth.options.stores[i];

    if (typeof store[action] === "function") {
      return store[action](...args, auth);
    }

    if (store === "storage" && isLocalStorage() && isSessionStorage()) {
      return storage[action](...args, auth);
    }

    if (store === "cookie" && isCookieStorage()) {
      return cookie[action](...args, auth);
    }
  }
}

function get(key: string | null, auth: Auth) {
  return processToken("get", key, auth);
}

function set(key, token, expires, auth: Auth) {
  return processToken("set", key, token, expires, auth);
}

function remove(key: string) {
  return processToken("remove", key);
}

const token = {
  get,
  set,
  remove,
};

export default cookie;
