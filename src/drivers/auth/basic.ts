import { defineAuthDriver } from "../../type/drivers/AuthDriver"

export default defineAuthDriver({
  request(auth, options, token) {
    // eslint-disable-next-line functional/immutable-data
    options.headers["Authorization"] = token

    return options
  },

  response(auth, { headers }) {
    return headers.Authorization || headers.authorization
  },
})
