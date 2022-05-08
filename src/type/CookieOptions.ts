import TypeOrFnReturn from "./utils/TypeOrFnReturn"

type CookieOptions = {
  path?: TypeOrFnReturn<string> //"/",
  domain?: TypeOrFnReturn<string> //null
  secure?: TypeOrFnReturn<boolean>
  expires?: TypeOrFnReturn<number | Date | string>
  sameSite?: TypeOrFnReturn<string>
}

export default CookieOptions
