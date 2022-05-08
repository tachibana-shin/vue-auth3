import AuthDriver from "../../type/drivers/AuthDriver"

const driver: AuthDriver = {
  request(auth, options, token) {
    // eslint-disable-next-line functional/immutable-data
    options.headers["Authorization"] = token

    return options
  },

  response(auth, { headers }) {
    return headers.Authorization || headers.authorization
  },
}

export default driver
