import AuthDriver from "../../type/drivers/AuthDriver"

const driver: AuthDriver = {
    request (req, token) {
        this.drivers.http.setHeaders.call(this, req, {
            Authorization: 'Bearer ' + token
        });
    },

    response (res) {
        var headers = this.drivers.http.getHeaders.call(this, res),
            token   = headers.Authorization || headers.authorization;

        if (token) {
            token = token.split(/Bearer:?\s?/i);

            return token[token.length > 1 ? 1 : 0].trim();
        }
    }
};

export default driver