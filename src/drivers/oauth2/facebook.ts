import { defineOAuth2Driver } from "../../type/drivers/OAuth2Driver"

export default defineOAuth2Driver({
  url: "https://www.facebook.com/v2.5/dialog/oauth",

  params: {
    client_id: "",
    redirect_uri: "login/facebook",
    response_type: "code",
    scope: "email",
    state: {},
  },
})
