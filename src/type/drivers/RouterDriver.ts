
import type { RouteLocationRaw } from "vue-router";

type RouterDriver = {
	init: (this: Auth) => void
	beforeEach: (routerBeforeEach: () => void, transitionEach: (transition: RouteLocationNormalized, auth: Auth, redirect: string) => void, setTransition: (transition: RouteLocationNormalized) => void,  getAuthMeta: (transition: RouteLocationNormalized) => Auth) => void
routerReplace: (router :RouteLocationRaw) => void;
routerGo:  (router :RouteLocationRaw) => void;
}

export default ROuterDriver