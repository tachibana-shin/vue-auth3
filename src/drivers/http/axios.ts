import axios from "axios"

import HttpDriver from "../../type/drivers/HttpDriver"

const driver: HttpDriver = {
  request: axios,
}

export default driver
