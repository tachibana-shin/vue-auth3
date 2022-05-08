import AuthDriver from "../../type/drivers/AuthDriver"

const driver: AuthDriver = {
  request(auth, options, token) {
    // eslint-disable-next-line functional/immutable-data
    options.headers["Authorization"] = "Bearer " + token

    return options
  },

  response(auth, { headers }) {
    const token = headers.Authorization || headers.authorization

    if (token) {
      const i = token.split(/Bearer:?\s?/i)

      return i[i.length > 1 ? 1 : 0].trim()
    }

    return null
  },
}

export default driver
