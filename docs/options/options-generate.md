## redirect

```ts
 @typeof RouteLocationRaw;
```

Specify the default router route redirect to use.

## fetchUser

```ts
@typeof boolean;
```

Specify whether to fetch a user or not after a request.

For instance after login or oauth2 requests.

## remember

```ts
@typeof boolean;
```

Specify whether the information will be stored the next time it is accessed.

This is a dynamic option that should be set during the method call.

## makeRequest

```ts
@typeof boolean;
```

Specify whether to trigger an API call first.

In some cases such as with logout or unimpersonate a request to the API may not be required.

## enabled

```ts
@typeof boolean;
```

Specify whether a feature is enabled.

Primarily used with refresh and fetch methods.

## enabledInBackground

```ts
@typeof boolean;
```

Enable that function but only allow them to run in the background and do not block rendering router
