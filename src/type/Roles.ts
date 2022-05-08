type Roles =
  | string
  | (string | string[] | Record<string, unknown>)[]
  | Record<string, (string | string[] | Record<string, unknown>)[]>

export default Roles
