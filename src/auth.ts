import Options from "./type/Options"
import { compare, getProperty, extend } from "./utils"
import $token from "./helpers/token"
import { RouteLocationNormalized } from "vue-router"

let $auth : Auth;

const __defaultOption: Options = {
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

  authRedirect: "/login" ,
  forbiddenRedirect:"/403" ,
  notFoundRedirect: "/404" ,

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
   url: "auth/user", method: "GET", enabled: true },
  refreshData: {
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

  // External

  getUrl: _getUrl,
  getCookieDomain: _getCookieDomain,
  parseUserData: _parseUserData,
};

function _isAccess(role: string, key: string): boolean {
  if ($auth.state.authenticated === true) {
    if (role) {
      return compare(
        role,
        getProperty(
          $auth.state.data || {},
          key || $auth.options.rolesKey
        )
      );
    }

    return true;
  }

  return false;
}

function _isTokenExpired() {
  return !$token.get(null, $auth);
}

function _getAuthMeta({
 to, matched }: RouteLocationNormalized) {

  if (to) {
    return to

  }

let auth;
  const  authRoutes = matched.filter(({ meta }) =>
      Object.prototype.hasOwnProperty.call(meta, "auth")
    );

    // matches the nested route, the last one in the list
    if (authRoutes.length) {
      auth = authRoutes[authRoutes.length - 1].meta.auth;
    }

  return auth;
}

function _getCookieDomain() {
  return window.location.hostname;
}

function _getUrl() {
  const port = window.location.port;

  return `${window.location.protocol}//${window.location.hostname}${
    port ? `:${port}` : ""
  }`;
}

function _getRemember() {
  return $token.get.call($auth, $auth.options.rememberKey);
}

function _setUser(data) {
  $auth.state.data = data;
}

function _setLoaded(loaded) {
  $auth.state.loaded = loaded;
}

function _setAuthenticated(authenticated) {
  $auth.state.loaded = true;
  $auth.state.authenticated = authenticated;
}

function _setStaySignedIn(staySignedIn) {
  if (staySignedIn === true) {
    $token.set.call($auth, $auth.options.staySignedInKey, "true", false);
  } else {
    $token.remove.call($auth, $auth.options.staySignedInKey);
  }
}

function _setRemember(val) {
  if (val) {
    $token.set.call($auth, $auth.options.rememberKey, val, false);
    $auth.state.remember = val;
  } else {
    $token.remove.call($auth, $auth.options.rememberKey);
    $auth.state.remember = null;
  }
}

function _setTransitions(transition) {
  $auth.transitionPrev = $auth.transitionThis;
  $auth.transitionThis = transition;
}

function _parseUserData(data) {
  return data.data || {};
}

function _parseUserResponseData(res) {
  return $auth.options.parseUserData($auth.drivers.http.httpData(res));
}

function _parseRedirectUri(uri = "") {
  if (/^https?:\/\//.test(uri)) {
    return uri;
  }

  return `${_getUrl()}/${uri.replace(/^\/|\/$/g, "")}`;
}

function _parseRequestIntercept(req) {
  let token;
  let tokenName;

  if (req && req.ignoreVueAuth) {
    return req;
  }

  if (req.impersonating === false && $auth.impersonating()) {
    tokenName = $auth.options.tokenDefaultKey;
  }

  token = $token.get.call($auth, tokenName);

  if (token) {
    $auth.drivers.auth.request.call($auth, req, token);
  }

  return req;
}

function _parseResponseIntercept(res, req) {
  let token;

  if (req && req.ignoreVueAuth) {
    return;
  }

  _processInvalidToken(res, $auth.transitionThis);

  token = $auth.drivers.auth.response.call($auth, res);

  if (token) {
    $token.set.call(
      $auth,
      null,
      token,
      $token.get.call($auth, $auth.options.staySignedInKey) ? false : true
    );
  }
}

function _processInvalidToken(res, transition) {
  let auth;
  let redirect;

  if (
    !$auth.drivers.http.invalidToken ||
    !$auth.drivers.http.invalidToken.call($auth, res)
  ) {
    return;
  }

  if (transition) {
    auth = _getAuthMeta(transition);
  }

  if (auth) {
    redirect = auth.redirect || $auth.options.authRedirect;
  }

  _processLogout(redirect);
}

function _processRouterBeforeEach(cb) {
  const isTokenExpired = _isTokenExpired();

  if (isTokenExpired && $auth.state.authenticated) {
    _processLogout();
  }

  if (
    !isTokenExpired &&
    !$auth.state.loaded &&
    $auth.options.refreshData.enabled
  ) {
    $auth.refresh().then(
      () => {
        _processAuthenticated(cb);
      },
      () => {
        _processAuthenticated(cb);
      }
    );

    return;
  }

  _processAuthenticated(cb);
}

function _processAuthenticated(cb) {
  if ($auth.state.authenticated === null && $token.get.call($auth)) {
    if ($auth.options.fetchData.enabled) {
      $auth.fetch().then(cb, cb);
    } else {
      _processFetch({});

      return cb.call($auth);
    }
  } else {
    _setLoaded(true);

    return cb.call($auth);
  }
}

function _processTransitionEach(transition, routeAuth, cb) {
  let authRedirect = (routeAuth || "").redirect || $auth.options.authRedirect;
  let forbiddenRedirect =
    (routeAuth || "").forbiddenRedirect ||
    (routeAuth || "").redirect ||
    $auth.options.forbiddenRedirect;
  let notFoundRedirect =
    (routeAuth || "").notFoundRedirect ||
    (routeAuth || "").redirect ||
    $auth.options.notFoundRedirect;
  const rolesKey = (routeAuth || "").rolesKey || $auth.options.rolesKey;

  routeAuth = __utils.toArray(
    (routeAuth || "").roles !== undefined ? routeAuth.roles : routeAuth
  );

  if (
    routeAuth &&
    (routeAuth === true ||
      routeAuth.constructor === Array ||
      __utils.isObject(routeAuth))
  ) {
    if (!$auth.check()) {
      $auth.transitionRedirectType = 401;

      if (typeof authRedirect === "function") {
        authRedirect = authRedirect(transition);
      }

      cb.call($auth, authRedirect);
    } else if (
      (routeAuth.constructor === Array || __utils.isObject(routeAuth)) &&
      !__utils.compare(
        routeAuth,
        __utils.getProperty($auth.state.data || {}, rolesKey)
      )
    ) {
      $auth.transitionRedirectType = 403;

      if (typeof forbiddenRedirect === "function") {
        forbiddenRedirect = forbiddenRedirect(transition);
      }

      cb.call($auth, forbiddenRedirect);
    } else {
      $auth.state.redirect = $auth.transitionRedirectType
        ? {
            type: $auth.transitionRedirectType,
            from: $auth.transitionPrev,
            to: $auth.transitionThis,
          }
        : null;
      $auth.transitionRedirectType = null;

      return cb();
    }
  } else if (routeAuth === false && $auth.check()) {
    $auth.transitionRedirectType = 404;

    if (typeof notFoundRedirect === "function") {
      notFoundRedirect = notFoundRedirect(transition);
    }

    cb.call($auth, notFoundRedirect);
  } else {
    $auth.state.redirect = $auth.transitionRedirectType
      ? {
          type: $auth.transitionRedirectType,
          from: $auth.transitionPrev,
          to: $auth.transitionThis,
        }
      : null;
    $auth.transitionRedirectType = null;

    return cb();
  }
}

function _processFetch(data, redirect) {
  _setUser(data);

  _setAuthenticated(true);

  _processRedirect(redirect);
}

function _processLogout(redirect) {
  __cookie.remove.call($auth, $auth.options.tokenImpersonateKey);
  __cookie.remove.call($auth, $auth.options.tokenDefaultKey);

  $token.remove.call($auth, $auth.options.tokenImpersonateKey);
  $token.remove.call($auth, $auth.options.tokenDefaultKey);

  $token.remove.call($auth, $auth.options.staySignedInKey);

  $auth.state.loaded = true;
  $auth.state.authenticated = false;
  $auth.state.data = null;

  _processRedirect(redirect);
}

function _processImpersonate(defaultToken, redirect) {
  $token.set.call(
    $auth,
    $auth.options.tokenImpersonateKey,
    $auth.token(),
    $token.get.call($auth, $auth.options.staySignedInKey) ? false : true
  );
  $token.set.call(
    $auth,
    $auth.options.tokenDefaultKey,
    defaultToken,
    $token.get.call($auth, $auth.options.staySignedInKey) ? false : true
  );
  $auth.state.impersonating = true;

  _processRedirect(redirect);
}

function _processUnimpersonate(redirect) {
  $token.remove.call($auth, $auth.options.tokenImpersonateKey);
  $auth.state.impersonating = false;

  _processRedirect(redirect);
}

function _processRedirect(redirect) {
  if (redirect) {
    $auth.drivers.router.routerGo.call($auth, redirect);
  }
}

function _initDriverCheck() {
  let msg;
  let i;
  let ii;
  const drivers = ["auth", "http", "router"];

  for (i = 0, ii = drivers.length; i < ii; i++) {
    if (!$auth.drivers[drivers[i]]) {
      console.error(
        `Error (@websanova/vue-auth): "${drivers[i]}" driver must be set.`
      );

      return false;
    }

    if ($auth.drivers[drivers[i]].init) {
      msg = $auth.drivers[drivers[i]].init.call($auth);

      if (msg) {
        console.error(`Error (@websanova/vue-auth): ${msg}`);

        return false;
      }
    }
  }
}

function _initRefreshInterval() {
  if (
    $auth.options.refreshData.enabled &&
    $auth.options.refreshData.interval > 0
  ) {
    setInterval(() => {
      if ($auth.options.refreshData.enabled && !_isTokenExpired()) {
        $auth.refresh();
      }
    }, $auth.options.refreshData.interval * 1000 * 60); // In minutes.
  }
}

function _initInterceptors() {
  $auth.drivers.http.interceptor.call(
    $auth,
    _parseRequestIntercept,
    _parseResponseIntercept
  );

  $auth.drivers.router.beforeEach.call(
    $auth,
    _processRouterBeforeEach,
    _processTransitionEach,
    _setTransitions,
    _getAuthMeta
  );
}

class Auth {
  public state = {

          data: null,
          loaded: false,
          redirect: null,
          authenticated: null, // TODO: false ?
          impersonating: undefined,
          remember: undefined,
        
  }
  public options: Required<Options>;
  constructor(Vue, options: Partial<Options> = {}) {
    $auth = this;

    this.plugins = options.plugins;
    this.drivers = options.drivers;
    this.options = extend(__defaultOption, [options]) as any;

    delete options.plugins;
    delete options.drivers;
    delete options.options;

    // Init vars.

    this.currentToken = null;
    this.transitionPrev = null;
    this.transitionThis = null;
    this.transitionRedirectType = null;

    _initDriverCheck();

    _initVm(Vue);

    _initRefreshInterval();

    _initInterceptors();
  }

  ready() {
    return $auth.state.loaded;
  }

  load() {
    return new Promise((resolve) => {
      let timer = null;

      timer = setInterval(() => {
        if ($auth.state.loaded) {
          clearInterval(timer);

          resolve();
        }
      }, 50);
    });
  }

  redirect() {
    return $auth.state.redirect;
  }

  user(data) {
    if (data !== undefined) {
      _processFetch(data);
    }

    return $auth.state.data;
  }

  check(role, key) {
    return _isAccess(role, key);
  }

  impersonating() {
    const impersonating = $token.get.call(
      $auth,
      $auth.options.tokenImpersonateKey
    )
      ? true
      : false;

    if ($auth.state.impersonating === undefined) {
      $auth.state.impersonating = impersonating;
    }

    return $auth.state.impersonating;
  }

  token(name, token, expires) {
    if (token !== undefined) {
      if (token === null) {
        $token.remove.call($auth, name);
      } else {
        expires =
          expires === true || expires === false
            ? expires
            : $token.get.call($auth, $auth.options.staySignedInKey)
            ? false
            : true;

        $token.set.call($auth, name, token, expires);
      }
    }

    return $token.get.call($auth, name);
  }

  fetch(data) {
    data = __utils.extend($auth.options.fetchData, data);

    return new Promise((resolve, reject) => {
      $auth.drivers.http.http.call($auth, data).then((res) => {
        _processFetch(_parseUserResponseData(res), data.redirect);

        resolve(res);
      }, reject);
    });
  }

  refresh(data) {
    data = __utils.extend($auth.options.refreshData, data);

    return $auth.drivers.http.http.call($auth, data);
  }

  register(data) {
    const registerData = __utils.extend($auth.options.registerData, data);

    if (registerData.autoLogin !== true) {
      _setRemember(registerData.remember);
      _setStaySignedIn(registerData.staySignedIn);
    }

    return new Promise((resolve, reject) => {
      $auth.drivers.http.http.call($auth, registerData).then((res) => {
        let loginData;

        if (registerData.autoLogin) {
          loginData = __utils.extend($auth.options.loginData, data);

          $auth.login(loginData).then(resolve, reject);
        } else {
          resolve(res);

          _processRedirect(registerData.redirect);
        }
      }, reject);
    });
  }

  login(data) {
    data = __utils.extend($auth.options.loginData, data);

    _setRemember(data.remember);
    _setStaySignedIn(data.staySignedIn);

    return new Promise((resolve, reject) => {
      $auth.drivers.http.http.call($auth, data).then(
        (res) => {
          if (
            data.fetchUser ||
            (data.fetchUser === undefined && $auth.options.fetchData.enabled)
          ) {
            $auth
              .fetch({
                redirect: data.redirect,
              })
              .then(resolve, reject);
          } else {
            _processFetch(_parseUserResponseData(res), data.redirect);

            resolve(res);
          }
        },
        (res) => {
          _setAuthenticated(false);

          reject(res);
        }
      );
    });
  }

  remember(val) {
    if (val) {
      _setRemember(val);
    }

    const remember = _getRemember();

    if ($auth.state.remember === undefined) {
      $auth.state.remember = remember;
    }

    return $auth.state.remember;
  }

  unremember() {
    _setRemember(null);
  }

  logout(data) {
    data = __utils.extend($auth.options.logoutData, data);

    return new Promise((resolve, reject) => {
      if (data.makeRequest) {
        $auth.drivers.http.http.call($auth, data).then((res) => {
          _processLogout(data.redirect);

          resolve(res);
        }, reject);
      } else {
        _processLogout(data.redirect);

        resolve();
      }
    });
  }

  impersonate(data) {
    data = __utils.extend($auth.options.impersonateData, data);

    return new Promise((resolve, reject) => {
      const token = $auth.token();

      $auth.drivers.http.http.call($auth, data).then((res) => {
        _processImpersonate(token);

        if (
          data.fetchUser ||
          (data.fetchUser === undefined && $auth.options.fetchData.enabled)
        ) {
          $auth
            .fetch({
              redirect: data.redirect,
            })
            .then(resolve, reject);
        } else {
          _processRedirect(data.redirect);

          resolve(res);
        }
      }, reject);
    });
  }

  unimpersonate(data) {
    data = __utils.extend($auth.options.unimpersonateData, data);

    return new Promise((resolve, reject) => {
      if (data.makeRequest) {
        $auth.drivers.http.http.call($auth, data).then(resolve, reject);
      } else {
        resolve();
      }
    }).then(
      () =>
        new Promise((resolve, reject) => {
          _processUnimpersonate();

          if (
            data.fetchUser ||
            (data.fetchUser === undefined && $auth.options.fetchData.enabled)
          ) {
            $auth
              .fetch({
                redirect: data.redirect,
              })
              .then(resolve, reject);
          } else {
            _processRedirect(data.redirect);

            resolve();
          }
        })
    );
  }

  oauth2(type, data) {
    let key;
    const params = [];

    if (data.code) {
      try {
        if (data.state) {
          data.state = JSON.parse(decodeURIComponent(data.state));
        }
      } catch (e) {
        console.error(
          "vue-auth:error There was an issue retrieving the state data."
        );
        data.state = data.state || {};
      }

      data = __utils.extend($auth.options.oauth2Data, [data.state, data]);

      delete data.code;
      delete data.state;
      delete data.params;

      return $auth.login(data);
    }

    data = __utils.extend($auth.drivers.oauth2[type], data);

    data.params.state = JSON.stringify(data.params.state || {});
    data.params.redirect_uri = _parseRedirectUri(data.params.redirect_uri);

    Object.keys(data.params).forEach((key) => {
      params.push(`${key}=${encodeURIComponent(data.params[key])}`);
    });

    window.open(
      `${data.url}?${params.join("&")}`,
      (data.window || {}).name || "_self",
      (data.window || {}).specs || {},
      (data.window || {}).replace !== false
    );
  }

  enableImpersonate() {
    if ($auth.impersonating()) {
      $auth.currentToken = null;
    }
  }

  disableImpersonate() {
    if ($auth.impersonating()) {
      $auth.currentToken = $auth.options.tokenDefaultKey;
    }
  }
}

export default Auth;
