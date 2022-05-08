/* eslint-disable functional/prefer-readonly-type */
import Auth from "../../Auth"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HttpDriver<IRequest = any, IResponse = any> = {
  init: (auth: Auth) => void
  interceptor: (auth: Auth, req: IRequest, res: IResponse) => void
  invalidToken: (auth: Auth, res: IRequest) => boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  httpData: (auth: Auth, obj: any) => any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  http: (auth: Auth, data: any) => any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getHeaders: (auth: Auth, res: IResponse) => any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setHeaders: (auth: Auth, req: IRequest, headers: any) => void
}

export default HttpDriver
