The `cookie` option specifies parameters to store with the cookie. It contains a key / value pairing with the key being the parameter name and the value being set accordingly based on a few simple rules described below.

> This only applies when using the `cookie` storage option.

With this setup there are some default minimum values for the cookies. But any others can be added or removed by extending or overriding this parameter.

## Values

By default values ​​stored in `stores` including `cookie` will be coerced to `string` by `JSON.stringify`

## Expires Key

There is one special built in case with the `cookiee.xpires` value. The correct value for this is a date string. However, there is a built in check for a non string integer offset value that will automatically convert to a date. This is to simplify things with a simple offset.

### Example

We can take a look at some of the current default values:

```ts
    cookie: {
        path:     '/',
        domain:   null,
        secure:   true,
        expires:  12096e5,
        sameSite: 'None',
    }
```

If the set cookie function is run with a key/value of "myval" and "blah" the resulting cookie would look something like the following.

```js
document.cookie =
  "myval=blah; path=/; domain=vue-auth3.js.org; Secure; Expires=${Date.now() + 12096e5}; SameSite=None;"
```

In the above example, the domain was dynamically returned from the `getCookieDomain` function and the `expires` was automatically converted to a date string for us.

Any other parameters added there would follow the same pattern.
