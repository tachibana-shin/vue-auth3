import HttpDriver from "../../type/drivers/HttpDriver"
import type { HttpResponse, HttpOptions as HttpRequest } from "vue-resource"

const driver: HttpDriver<HttpResponse, HttpRequest> = {
    init () {
        console.warn("[vue-auth3]: vue-resource is not compatible with vue 3 and can cause confusing errors! Please replace it with axios or fetch.")
        if ( ! this.plugins.http) {
            return 'drivers/http/vue-resource.1.x.js: http plugin has not been set.';
        }
    },
    
    interceptor (req, res) {

        this.plugins.http.interceptors.push( (request, next) => {
            if (req) { 
                req.call(this, request); }
            
            next( (response) => {
                if (res) { 
                    res.call(this, response, request); }
            });
        });
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
        const data = {} as any

        for (const i in res.headers.map) {
            data[i] = res.headers.map[i][0];
        }

        return data;
    },

    setHeaders (req, headers) {

        for (const i in headers) {
            req.headers.set(i, headers[i]);
        }
    }
};