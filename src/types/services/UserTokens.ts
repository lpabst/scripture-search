import { JwtTokens } from "./JwtTokens";

export type UserTokens = JwtTokens & {
  refreshToken: string;
};
