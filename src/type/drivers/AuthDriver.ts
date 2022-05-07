import Options from "../Options"

type AuthDriver <IRequest = Request, IResponse = Response>= {
	tokens?: string[]
	request: (this: Auth, req: IRequest, token: string) => void
	response: (this: Auth, res: IResponse)
}

export default AuthDriver