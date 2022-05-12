import Options from "./type/Options"

const __defaultOption: Partial<Options> = {
  // Variables

  rolesKey: "roles",
  rememberKey: "auth_remember",
  staySignedInKey: "auth_stay_signed_in",
  tokenDefaultKey: "auth_token_default",
  tokenImpersonateKey: "auth_token_impersonate",
  stores: ["storage", "cookie"],

  cookie: {
    path: "/",
    domain: void 0,
    secure: true,
    expires: 12096e5,
    sameSite: "None",
  },

  // Redirects

  authRedirect: "/login",
  forbiddenRedirect: "/403",
  notFoundRedirect: "/404",

  // Http

  registerData: {
    url: "auth/register",
    method: "POST",
    redirect: "/login",
    autoLogin: false,
  },
  loginData: {
    url: "auth/login",
    method: "POST",
    redirect: "/",
    fetchUser: true,
    staySignedIn: true,
  },
  logoutData: {
    url: "auth/logout",
    method: "POST",
    redirect: "/",
    makeRequest: false,
  },
  fetchData: {
    url: "auth/user",
    method: "GET",
    enabled: true,
  },
  refreshToken: {
    url: "auth/refresh",
    method: "GET",
    enabled: true,
    interval: 30,
  },
  impersonateData: {
    url: "auth/impersonate",
    method: "POST",
    redirect: "/",
    fetchUser: true,
  },
  unimpersonateData: {
    url: "auth/unimpersonate",
    method: "POST",
    redirect: "/admin",
    fetchUser: true,
    makeRequest: false,
  },
  oauth2Data: {
    url: "auth/social",
    method: "POST",
    redirect: "/",
    fetchUser: true,
  },
}

export default __defaultOption
