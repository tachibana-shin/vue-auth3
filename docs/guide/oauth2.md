The main thing to keep in mind with making OAuth requests is that the process takes two steps.

## Resources

It may be good to review the following guides for this section.

- [Requests Guide](/guide/requests)
- [OAuth2 Drivers](/guide/drivers.html#oauth2-drivers)

### Step 1: Social Redirect

When we call the `auth.oauth2()` without the `code` set to `true` it will attempt to first redirect to the social site to fetch a token.

For instance with Facebook it will redirect you to the app permissions screen where you can either accept or reject the applications access and permissions.

In this case the driver options are the ones that are passed in and can be overridden.

```ts
auth.oauth2("facebook", {
  params: {
    client_id: "facebook-client-id",
    state: {},
  },
})
```

### Step 2: API call

If all went well in step 1 above the social app/site should redirect back to our app with a very short lived token. We then need to pass that token to our API and use that to make a request for user data from the third party auth service. Typically this should at least give us a unique id, email and name.

To trigger this off we will need to pass in `code` set to `true`. It will then use the `options.oauth2Data` data to make the request to our API.

This then follows our normal requests flow.

```ts
auth.oauth2("facebook", {
  url: "auth/facebook",
  code: true,
  body: {
    code: this.$route.query.code,
  },
  state: this.$route.query.state,
})
```

## State

So what happens if we need to pass some state back to our app. For instance whether "stay signed in" was selected by the user or not. This is already supported by the OAuth2 spec with a special request parameter called `state`.

So as you will see in Step 1 above we can pass in any `params.state` data into the OAuth2 request.

Then on the flip side we just pass the data right back in. The plugin should handle the rest for us and pass any login options directly in.

## Window

The `oauth2` call also accepts a `window` parameter to customize how to trigger the window. It follows the `window.open` format allowing any parameters to be passed in directly.

```ts
    form: {
        body: {},
        params: {
            state: {
                remember: false,
                staySignedIn: true,
                fetchUser: true,
            }
        },
        window: {
            name: '_blank',
            specs: {},
            replace: false
        }
    }

```
