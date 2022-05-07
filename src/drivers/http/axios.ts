import HttpDriver from "../../type/drivers/HttpDriver"
import type { AxiosRequest, AxiosResponse } from "axios"

const driver: HttpDriver<AxiosRequest, AxiosResponse> = {

    init() {
        if ( ! this.plugins.http) {
            return 'drivers/http/axios.js: http plugin has not been set.'
        }
    },

    interceptor (req, res) {

        if (req) {
            this.plugins.http.interceptors.request.use( (request) => {
                req.call(this, request)
                
                return request;
            },  (error) => {
                req.call(this, error.request);
            
                return Promise.reject(error);
            });
        }

        if (res) {
            this.plugins.http.interceptors.response.use( (response)=> {
                res.call(this, response);
        
                return response;
            }, (error) => {
                if (error && error.response) {
                    res.call(this, error.response);
                }

                return Promise.reject(error);
            });
        }
    },

    invalidToken (res) {
        if (res.status === 401) {
            return true;
        }
    },

    httpData (res) {
        return res.data || {};
    },

    http (data) {
        return this.plugins.http(data);
    },

    getHeaders (res) {
        return res.headers;
    },

    setHeaders (req, headers) {
        req.headers.common = Object.assign({}, req.headers.common, headers);
    }
}