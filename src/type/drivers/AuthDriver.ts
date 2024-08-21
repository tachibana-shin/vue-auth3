import Auth from "../../Auth";
import HttpDriver from "./HttpDriver";

type OptionRequest = {
  data?: Parameters<HttpDriver["request"]>[0]["data"];
  headers: Required<Parameters<HttpDriver["request"]>[0]>["headers"];
};

type AuthDriver = {
  tokens?: string[];
  request: (auth: Auth, options: OptionRequest, token: string) => OptionRequest;
  response: (auth: Auth, response: Awaited<ReturnType<HttpDriver["request"]>>) => string | null;
};

export const defineAuthDriver = (opts: AuthDriver): AuthDriver => {
  return opts;
};

export default AuthDriver;