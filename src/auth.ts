import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (typeof token.accessToken === 'string') {
        session.accessToken = token.accessToken;
      } else {
        session.accessToken = undefined;
      }
      if (typeof token.refreshToken === 'string') {
        session.refreshToken = token.refreshToken;
      } else {
        session.refreshToken= undefined;
      }
      return session;
    },
  },
});
