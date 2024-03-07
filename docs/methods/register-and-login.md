## register

```ts
auth.register(options: AxiosRequestConfig & Options["registerData"]) => Promise<AxiosResponse>
```

Execute a register request.

#### Examples

```vue
<script lang="ts" setup>
const auth = useAuth()

function register() {
  auth.register({
    body: {
      email: "hello@example.com",
      password: "abcd1234",
    },
    redirect: { name: "user-account" },
    remember: true,
    staySignedIn: true,
    autoLogin: true,
    fetchUser: true,
  })
}
</script>
```

#### References

- [Requests Guide](/guide/requests)
- [registerData Option](/options/core#registerdata)
- [remember() Method](/methods/utils#remember)

### login

```ts
auth.login(options: AxiosRequestConfig & Options["loginData"]) => Promise<AxiosResponse>
```

Execute a login request.

#### Examples

```vue
<script lang="ts" setup>
const auth = useAuth()

function login() {
  auth.login({
    body: {
      email: "hello@example.com",
      password: "abcd1234",
    },
    redirect: { name: "user-account" },
    remember: "Rob",
    staySignedIn: true,
    fetchUser: true,
  })
}
</script>
```

#### References

- [Requests Guide](/guide/requests)
- [loginData Option](/options/core#logindata)
- [remember() Method](/methods/utils#remember)

## oauth2

```ts
auth.oauth2(options: AxiosRequestConfig & OAuth2Config) => Promise<AxiosResponse>
```

Execute an oauth2 request.

It's important to note that there are actually two separate parts to this process. The initial request (to Facebook, etc) is made to accept permissions for the app and generate a token. That token is then sent back to the app. At that point the app should generate a request to the api to then fetch the "social" user data and create a user.

#### Examples

The initial request to FB, Google, etc.

```vue
<script lang="ts" setup>
const auth = useAuth()

        function oauth2() {
           auth
                .oauth2({
                    params: {
                        client_id: 'FACEBOOK_CLIENT_ID'
                        ...
                    },
                    remember: 'Rob',
                    staySignedIn: true,
                    fetchUser: true,
                    window: {
                        name: '_blank',
                        specs: {},
                        replace: false
                    }
                });
        }
</script>
```

The second request to trigger the API call must set `code` to `true`.

```vue
<script lang="ts" setup>
const auth = useAuth()

function oauth2() {
  auth.oauth2({
    code: true,
    redirect: { name: "user-account" },
    state: this.$route.query.code,
    body: {
      token: this.$route.query.code,
    },
  })
}
</script>
```

#### References

- [OAuth2 Guide](/guide/oauth2)
- [Drivers Guide](/guide/drivers)
- [Requests Guide](/guide/requests)
- [oauth2Data Option](/options/core#oauth2data)
- [remember() Method](/methods/utils#remember)

## logout

```ts
// if makeRequest: true
auth.logout(options: AxiosRequestConfig & Options["logoutData"]) => Promise<AxiosResponse>
// else
auth.logout(options: AxiosRequestConfig & Options["logoutData"]) => void
```

Execute a logout request.

#### Examples

```vue
<script lang="ts" setup>
const auth = useAuth()

function logout() {
  this.$auth.logout({
    makeRequest: true,
    redirect: { name: "auth-login" },
  })
}
</script>
```

#### References

- [Requests Guide](/guide/requests)
- [logoutData Option](/options/core#logoutdata)
