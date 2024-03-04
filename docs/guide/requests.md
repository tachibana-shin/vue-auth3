How requests are made is central to the vue-auth3 plugin so it's important to understand the request/response lifecycle.

Under the hood, all requests to the API are made using the HTTP driver and all of the methods will always return a `Promise` by `axios`.

For more details on individual method options check the [Options Guide](/options/core) and [Methods Guide](/methods/overview).

## Request Methods

These will always fire off a request.

- [auth.register()](/methods/register-and-login#register)
- [auth.login()](/methods/register-and-login#login)
- [auth.oauth2()](/methods/register-and-login#oauth2)
- [auth.fetch()](/methods/register-and-login#fetch)
- [auth.refresh()](/methods/register-and-login#refresh)
- [auth.impersonate()](/methods/register-and-login#impersonate)

## Request Methods (Optional)

By default these will not fire off a request. In order to do so the `makeRequest` option must be set to `true`.

- [unimpersonate()](/methods/register-and-login#unimpersonate)
- [logout()](/methods/register-and-login#logout)

## Request Steps

Every request follows 6 basic steps which sometimes repeat if additional calls need to be made.

### 1. Request Initiated

The request is initiated by the HTTP plugin used in the app. When making a method call with the VueAuth3 plugin this would route through the HTTP driver.

### 2. Request Processing

The request intercept fires and checks if a token is set. If set it will pass execution on to the auth driver `request` method. In there it formats the token for the request.

### 3. Response Returned

The HTTP plugin used in the app should receive a response. If this call was initiated by the vue-auth3 plugin this would continue to be routed via the HTTP driver.

### 4. Response Processing

The response intercept will fire and attempt to parse a token if set. If set it will then use the appropriate storage method to store the token for future requests.

### 5. Make Additional Calls

If we are making requests through a method in the vue-auth3 plugin there may be additional calls made. For instance with the login call we may fire a subsequent `fetch` call. If this is a regular app call this step is omitted.

### 6. Resolve Promise

Finally after all calls are made the promise will resolve and return control back to the initial call.

## Examples

Let's take a look at a few examples for some of the more commonly used vue-auth3 plugin methods.

### Login

The call to the login method will help to illustrate things a bit better.

```ts
auth
  .login()
  // Request initiated.
  // Request intercept has no token so skips.
  // Response returned by API.
  // Response intercept parses token if set.
  // Fire off $auth.fetch() if `fetchUser` is enabled.
  // Resolve Promise.
  .then(() => {
    // do something
  })
```

### Fetch

With the fetch method it follows a similar pattern to the login method call. However, in this case step 5 is omitted since the fetch call doesn't provide any special options for any additional calls.

```ts
auth
  .fetch()
  // Request initiated.
  // Request intercept formats token.
  // Response returned by API.
  // Response intercept has no token so skips.
  // Step 5 omitted.
  // Resolve Promise.
  .then(() => {
    // do something
  })
```

### Register

We can take a look at the register call as well and see that it follows a similar pattern as the login call. The only difference here being that it may makes two additional calls if `autoLogin` is enabled.

```ts
auth
  .register()
  // Request initiated.
  // Request intercept has no token so skips.
  // Response returned by API.
  // Response intercept parses token if set.
  // Fire off $auth.login() if `autoLogin` is enabled.
  // Fire off $auth.fetch() if `fetchUser` is enabled.
  // Resolve Promise.
  .then(() => {
    // do something
  })
```

## Create Custom Requests

You can make an authenticated request through VueAuth3

```ts
auth.http({
  url: "users/1/fetch",
})
```
