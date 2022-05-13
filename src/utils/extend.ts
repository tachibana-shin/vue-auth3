/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line functional/functional-parameters
export default function extend<T>(target: T, deep = 1, ...objs: any): any {
  objs.forEach((obj: any) => {
    for (const prop in obj) {
      if (
        deep > 0 &&
        typeof (target as any)[prop] === "object" &&
        (target as any)[prop] !== null &&
        typeof obj[prop] === "object" &&
        obj[prop] !== null
      ) {
        extend((target as any)[prop], deep - 1, obj[prop])

        continue
      }

      // eslint-disable-next-line functional/immutable-data
      ;(target as any)[prop] = obj[prop]
    }
  })

  return target
}
