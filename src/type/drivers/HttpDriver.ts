import Options from "../Options"

type HttpDriver<IRequest =any , IResponse=any > = {
	init: (this: Auth) => void;
	interceptor: (this: Auth, req: IRequest, res: IResponse) => void
	invalidToken?: (this: Auth, res: IRequest) => boolean;
	httpData?: (this: Auth, obj: any) => any;
	http?: (this: Auth, data: any) => any;
	getHeaders?: (this: Auth, res: IResponse) => 
Headers
	setHeaders?: (this: Auth, req: IRequest, headers: Headers) => void
}

export default HttpDriver