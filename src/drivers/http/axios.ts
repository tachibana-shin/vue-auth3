import HttpDriver from "../../type/drivers/HttpDriver"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const driver: HttpDriver<any, any> = {
  init(auth) {
    if (!auth.options.plugins.http) {
      return "drivers/http/axios.js: http plugin has not been set."
    }
  },

  interceptor(auth, req, res) {
    if (req) {
      auth.options.plugins.http.interceptors.request.use(
        (request) => {
          req.call(this, request)

          return request
        },
        (error) => {
          req.call(this, error.request)

          return Promise.reject(error)
        }
      )
    }

    if (res) {
      auth.options.plugins.http.interceptors.response.use(
        (response) => {
          res(auth, response)

          return response
        },
        (error) => {
          if (error && error.response) {
            res.call(this, error.response)
          }

          return Promise.reject(error)
        }
      )
    }
  },

  invalidToken(auth, res) {
    if (res.status === 401) {
      return true
    }

    return false
  },

  httpData(auth, res) {
    return res.data || {}
  },

  http(auth, data) {
    return auth.options.plugins.http(data)
  },

  getHeaders(auth, res) {
    return res.headers
  },

  setHeaders(auth, req, headers) {
    // eslint-disable-next-line functional/immutable-data
    req.headers.common = Object.assign({}, req.headers.common, headers)
  },
}

export default driver
