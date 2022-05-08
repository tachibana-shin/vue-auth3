type Roles =
  | string
  // eslint-disable-next-line functional/prefer-readonly-type
  | (string | string[] | Record<string, unknown>)[]
  // eslint-disable-next-line functional/prefer-readonly-type
  | Record<string, (string | string[] | Record<string, unknown>)[]>

export default Roles
