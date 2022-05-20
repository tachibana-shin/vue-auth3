The main concept to understand with tokens is in how they are stored.

In this guide we will review the set of token store options and how to use them.

```ts
const auth = createAuth({
        ...
        rememberkey:         'auth_remember',
        tokenDefaultKey:     'auth_token_default',
        tokenImpersonateKey: 'auth_token_impersonate',
        stores:              ['storage', 'cookie'],
    });

```

## Token Keys

You will see a few token (and remember) keys defined in the options. These are the default keys the data will be stored under in the browsers storage or cookies. The key names being used there are quite arbitrary but can be changed in case of some conflict with other keys. The `auth_` prefix helps to avoid these conflicts by acting as a namespace for the vue-auth plugin.

## Stores

The `stores` option defines the store methods to use in order based on availability. So for instance in the above example it will attempt to use the browsers "local storage" before defaulting down to the next available "cookie" method.

## Long Lived Vs. Short Lived

This applies to how long the data is stored, which for the most part is set using the `staySignedIn` option with the `login`, `register` and `oauth2` methods.

If the `staySignedIn` is set to `false` it will be "short lived" data and expire after the browser is closed. If set to `true` it will be "long lived" and remain available for when the user returns.

This is automatically handled by the plugin. In the case of short lived `storage` option it will use `sessionStorage` rather than `localStorage` to save the token or remember data. Likewise for the short lived `cookie` option it will set a cookie with no expiration date rather than one with a two week expiration.

## remember() Method

The remember data piggy backs off the same concepts and functionality as above. However it stores some remember data for when a user logs in/out and returns the site. For instance storing a user name for a welcome back message. Check the methods guide for more info on [remember() Method](/methods/utils#remember) usage.
