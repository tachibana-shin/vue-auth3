import defineAuthDriver from "./" // Adjust the path as necessary

const authDriver = defineAuthDriver({
  request(auth: any, options: any, token: any) {
    options.headers["Authorization"] = "Token " + token
    return options
  },

  response(auth: any, res: any) {
    const token = res.data.token
    console.log(token)
    if (token) {
      return token
    }
    return null
  },
})

test("defineAuthDriver", () => {
  expect(typeof authDriver).toBe("object")
})
