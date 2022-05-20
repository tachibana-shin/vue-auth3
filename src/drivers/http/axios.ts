import axios from "axios"

import { defineHttpDriver } from "../../type/drivers/HttpDriver"

export default defineHttpDriver({
  request: axios,
})
