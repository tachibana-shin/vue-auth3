// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TypeOrFnReturn<T, E = any> = T | ((this: E) => T)

export default TypeOrFnReturn
