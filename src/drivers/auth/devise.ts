import AuthDriver from "../../type/drivers/AuthDriver"

const driver: AuthDriver = {

    tokens: [
        'Token-Type', 'Access-Token', 'Client', 'Uid', 'Expiry',
        'token-type', 'access-token', 'client', 'uid', 'expiry'
    ],

    request (req, token) {
        const headers = {} as any,
            tokens = token.split('|');

        this.drivers.auth.tokens.forEach( (tokenName, index) => {
            if (tokens[index]) {
                headers[tokenName] = tokens[index];
            }
        });
        
        this.drivers.http.setHeaders.call(this, req, headers);
    },

    response (res) {
        const token = [],
            headers = this.drivers.http.getHeaders.call(this, res);

        if (headers['access-token'] || headers['Access-Token']) {
            this.drivers.auth.tokens.forEach( (tokenName) => {
                if (headers[tokenName]) {
                    token.push(headers[tokenName]);
                }
            });

            // Check if access-token more recent than last one
            if (!this.token() || parseInt(token[4], 10) >= parseInt(this.token().split('|')[4], 10)) {
                return token.join('|');
            }
        }
    }
};

export default driver;