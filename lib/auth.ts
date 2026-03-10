/**
 * Auth helpers for the booking flow.
 * Phase 7: NextAuth.js with Azure AD. Use getAuthSession() for server-side session;
 * on the client use signIn() / signOut() from "next-auth/react" with callbackUrl.
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export interface AuthUser {
  email: string;
  name?: string;
}

export interface AuthContext {
  isAuthenticated: boolean;
  user?: AuthUser;
}

/**
 * Get current auth session (user and auth state).
 * Uses NextAuth getServerSession; returns same shape as AuthContext for callers that need it.
 */
export async function getAuthSession(): Promise<AuthContext | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  return {
    isAuthenticated: true,
    user: {
      email: session.user.email,
      name: session.user.name ?? undefined,
    },
  };
}

/**
 * Sign-in and sign-out are handled by NextAuth. On the client use:
 *   signIn("azure-ad", { callbackUrl: returnTo })
 *   signOut({ callbackUrl: returnTo })
 * from "next-auth/react". No server-side getLoginUrl/getLogoutUrl needed.
 */
