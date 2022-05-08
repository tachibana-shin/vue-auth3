/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line functional/functional-parameters
export default function extend<T>(target: T, deep = 1, ...objs: any): any {
  objs.forEach((obj: any) => {
    for (const prop in obj) {
      if (
        typeof (target as any)[prop] === "object" &&
        (target as any)[prop] !== null &&
        typeof obj[prop] === "object" &&
        obj[prop] !== null &&
        deep > 0
      ) {
        extend((target as any)[prop], obj[prop])
      }

      // eslint-disable-next-line functional/immutable-data
      ;(target as any)[prop] = obj[prop]
    }
  })

  return target
}
