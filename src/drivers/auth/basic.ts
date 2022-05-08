import AuthDriver from "../../type/drivers/AuthDriver"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const driver: AuthDriver<any, any> = {
  request(auth, req, token) {
    auth.options.drivers.http?.setHeaders(auth, req, {
      Authorization: token,
    })
  },

  response(auth, res) {
    const headers = auth.options.drivers.http?.getHeaders(auth, res),
      token = headers.Authorization || headers.authorization

    return token
  },
}

export default driver
