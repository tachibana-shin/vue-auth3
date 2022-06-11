## useAuth
```ts
const user = useAuth<UserData>()

console.log(user.value)
```

return `ComputedRef<UserData | null>` allow only getters.