/* eslint-disable functional/prefer-readonly-type */
import Auth from "../../Auth"

type AuthDriver<IRequest = Request, IResponse = Response> = {
  tokens?: string[]
  request: (auth: Auth, req: IRequest, token: string) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: (auth: Auth, res: IResponse) => any
}

export default AuthDriver
