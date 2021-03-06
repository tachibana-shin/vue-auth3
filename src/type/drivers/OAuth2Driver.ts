type OAuth2Driver = {
  url: string

  params: {
    client_id: string
    redirect_uri: string
    response_type: string
    scope: string
    state: Record<string, unknown>
  }
}

export default OAuth2Driver
export function defineOAuth2Driver(opts: OAuth2Driver) {
  return opts
}
