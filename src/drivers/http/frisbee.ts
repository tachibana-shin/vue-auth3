/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpDriver from "../../type/drivers/HttpDriver"

const driver: HttpDriver<any, any> = {
  init(auth) {
    if (!auth.options.plugins.http) {
      return "drivers/http/frisbee.js: http plugin has not been set."
    }
  },

  interceptor(auth, req, res) {
    ;(auth.options.plugins.http as any).interceptor.register({
      request: (path: any, options: any) => {
        req.call(this, options)

        return [path, options]
      },
      requestError: (err: any) => {
        req.call(this, err.request)

        return Promise.reject(err)
      },
      response: (response: any) => {
        res.call(this, response)

        return response
      },
      responseError: (err: any) => {
        res.call(this, err.response)

        return Promise.reject(err)
      },
    })
  },

  invalidToken(auth, res) {
    if (res.status === 401) {
      return true
    }

    return false
  },

  httpData(req, res) {
    return res.body || {}
  },

  http(auth, data) {
    return (auth as any).options.plugins.http![data.method.toLowerCase()]!(
      data.url,
      data
    )
  },

  getHeaders(auth, res) {
    return res.headers
  },

  setHeaders(auth, req, headers) {
    // eslint-disable-next-line functional/immutable-data
    req.headers = Object.assign({}, req.headers, headers)
  },
}

export default driver
