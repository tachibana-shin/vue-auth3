import CookieOptions from "./CookieOptions";
import cookie from "../helpers/cookie";
import type { RouteLocationRaw } from "vue-router";
import type { Method, AxiosInstance } from "axios";
import HttpDriver from "./drivers/HttpDriver"
import HttpAuth from "./drivers/HttpAuth"
import OAuth2Driver from "./drivers/OAuth2Driver";
import AuthDriver from "./drivers/AuthDriver";
import RouterDriver from "./drivers/RouterDriver"

type HttpData = {
  url?: string;
  method?: Method;
  redirect?: RouteLocationRaw;
};
type Options = {
  //var
  rolesKey?: string;
  rememberKey?: string;
  staySignedInKey?: string;
  tokenDefaultKey?: string;
  tokenImpersonateKey?: string;
  stores?: ("cookie" | "storage" | typeof cookie)[];
  cookie?: CookieOptions;

  // Redirects

  authRedirect?: RouteLocationRaw;
  forbiddenRedirect?: RouteLocationRaw;
  notFoundRedirect?: RouteLocationRaw;

  // Http

  registerData?: HttpData & {
    autoLogin?: boolean;
  };
  loginData?: HttpData & {
    fetchUser?: boolean;
    staySignedIn?: boolean;
  };

  logoutData?: HttpData & {
    makeRequest?: boolean;
  };
  fetchData?: Omit<HttpData, "redirect"> & {
    enabled?: boolean;
  };
  refreshData?: Omit<HttpData, "redirect"> & {
    enabled?: boolean;
    interval?: 30;
  };
  impersonateData?: HttpData & {
    fetchUser?: boolean;
  };
  unimpersonateData?: HttpData & {
    fetchUser?: boolean;
    makeRequest?: boolean;
  };
  oauth2Data?: HttpData & {
    fetchUser?: true;
  };


  // External

  getUrl?: () => string,
  getCookieDomain?: () => string,
  parseUserData: <T = any>(obj: any) => T,


  // Plugin

  plugins?: {
    router?: Router;
    http?: AxiosInstance;
  }

  // Driver

  drivers?: {
    auth?: AuthDriver
    http?: HttpDriver;
    oauth2?: OAuth2Driver;
    router?: RouterDrive;
  }
};


export default Options;