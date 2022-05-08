type TypeOrFnReturn<T, E = any> = T | ((this: E) => T)

export default TypeOrFnReturn
