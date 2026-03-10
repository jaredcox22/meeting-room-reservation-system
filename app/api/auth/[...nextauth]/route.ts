import NextAuth, { type NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_CLIENT_ID ?? "",
      clientSecret: process.env.AZURE_CLIENT_SECRET ?? "",
      tenantId: process.env.AZURE_TENANT_ID ?? "",
    }),
  ],
  callbacks: {
    redirect({ url, baseUrl }) {
      const base = baseUrl.replace(/\/$/, "");
      let returnUrl: string;
      if (url.startsWith("/")) {
        returnUrl = `${base}${url}`;
      } else {
        try {
          const parsed = new URL(url);
          if (parsed.pathname.startsWith("/book/")) {
            returnUrl = `${base}${parsed.pathname}`;
          } else if (parsed.origin === new URL(baseUrl).origin) {
            returnUrl = url;
          } else {
            returnUrl = url === baseUrl || url === baseUrl + "/" ? `${base}/` : baseUrl;
          }
        } catch {
          returnUrl = url === baseUrl || url === baseUrl + "/" ? `${base}/` : baseUrl;
        }
      }
      return returnUrl;
    },
    jwt({ token, user }) {
      if (user?.email) token.email = user.email;
      if (user?.name) token.name = user.name;
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.email = token.email ?? session.user.email;
        session.user.name = token.name ?? session.user.name;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
