import AuthDriver from "../../type/drivers/AuthDriver"

const driver: AuthDriver = {
  request(auth, req, token) {
    auth.options.drivers.http?.setHeaders(auth, req, {
      Authorization: "Bearer " + token,
    })
  },

  response(auth, res) {
    const headers = auth.options.drivers.http?.getHeaders(auth, res),
      token = headers.Authorization || headers.authorization

    if (token) {
      const itoken = token.split(/Bearer:?\s?/i)

      return itoken[itoken.length > 1 ? 1 : 0].trim()
    }
  },
}

export default driver
