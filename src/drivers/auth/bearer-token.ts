import { defineAuthDriver } from "../../type/drivers/AuthDriver"

export default defineAuthDriver({
  request(auth, options, token) {
    // eslint-disable-next-line functional/immutable-data
    options.headers["Authorization"] = "Bearer " + token

    return options
  },

  response(auth, res) {
    const token = res.data.token

    if (token) {
      const i = token.split(/Bearer:?\s?/i)

      return i[i.length > 1 ? 1 : 0].trim()
    }

    return null
  },
})
