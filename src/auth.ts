import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async jwt({ token, account }) {
      // Initial sign-in
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token; // Get refresh token
      }
      return token;
    },
    async session({ session, token }) {
      // Attach accessToken to the session
      if (typeof token.accessToken === 'string') {
        session.accessToken = token.accessToken;
      } else {
        session.accessToken = undefined;
      }
      if (typeof token.refreshToken === 'string') {
        session.refreshToken = token.refreshToken;
      } else {
        session.refreshToken= undefined;
      }// Attach refresh token
      return session;
    },
  },
});
