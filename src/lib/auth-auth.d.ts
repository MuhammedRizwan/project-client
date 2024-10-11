import  { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    refreshToken?: string;
  }

  interface JWT extends DefaultJWT {
    accessToken?: string;
    refreshToken?: string;
  }
}