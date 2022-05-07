import AuthDriver from "../../type/drivers/AuthDriver"

const driver: AuthDriver = {
    request (req, token) {
        this.drivers.http.setHeaders.call(this, req, {
            Authorization: token
        });
    },
    
    response (res) {
        const headers = this.drivers.http.getHeaders.call(this, res),
            token   = headers.Authorization || headers.authorization;
        
        return token;
    }
}

export default driver;