import AuthDriver from "../../type/drivers/AuthDriver"

const driver: AuthDriver = {
  tokens: [
    "Token-Type",
    "Access-Token",
    "Client",
    "Uid",
    "Expiry",
    "token-type",
    "access-token",
    "client",
    "uid",
    "expiry",
  ],

  request(auth, req, token) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const headers = {} as any,
      tokens = token.split("|")

    auth.options.drivers.auth.tokens?.forEach((tokenName, index) => {
      if (tokens[index]) {
        // eslint-disable-next-line functional/immutable-data
        headers[tokenName] = tokens[index]
      }
    })

    auth.options.drivers.http?.setHeaders(auth, req, headers)
  },

  response(auth, res) {
    // eslint-disable-next-line functional/prefer-readonly-type, @typescript-eslint/no-explicit-any
    const token: any[] = [],
      headers = auth.options.drivers.http?.getHeaders(auth, res)

    if (headers["access-token"] || headers["Access-Token"]) {
      auth.options.drivers.auth.tokens?.forEach((tokenName) => {
        if (headers[tokenName]) {
          // eslint-disable-next-line functional/immutable-data
          token.push(headers[tokenName])
        }
      })

      // Check if access-token more recent than last one
      const tokenNow = auth.token()
      if (
        !tokenNow ||
        parseInt(token[4], 10) >= parseInt(tokenNow.split("|")[4], 10)
      ) {
        return token.join("|")
      }
    }
  },
}

export default driver
