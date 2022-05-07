import HttpDriver from "../../type/drivers/HttpDriver"

type FetchResponse = Awaited<typeof fetch("/")>
const driver: HttpDriver<Request, FetchResponse> = {
    init () {
        if ( ! this.plugins.http) {
            return 'drivers/http/frisbee.js: http plugin has not been set.'
        }
    },

    interceptor (req, res) {

        this.plugins.http.interceptor.register({
            request:  (path, options) => {
                req.call(this, options);
                
                return [path, options];
            },
            requestError: err => {
                req.call(this, err.request);
                
                return Promise.reject(err);
            },
            response: response => {
                res.call(this, response);
    
                return response;
            },
            responseError: err => {
                res.call(this, err.response);
                
                return Promise.reject(err);
            }
        });
    },

    invalidToken (res)  {

        if (res.status === 401) {
            return true;
        }
    },

    httpData(res) {
        return res.body || {};
    },

    http (data) {
        return this.plugins.http[data.method.toLowerCase()](data.url, data);
    },

    getHeaders(res) {
        return res.headers;
    },

    setHeaders (req, headers)  {
        req.headers = Object.assign({}, req.headers, headers);
    }
}

export default driver;