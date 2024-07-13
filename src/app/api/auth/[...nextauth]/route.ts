import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { TRPCError } from "@trpc/server";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    // Add more providers here if needed
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email,
          },
        });
        if (user && user.password) {
          const isValid = await verifyPassword(
            credentials.password,
            user.password
          );
          if (isValid) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
            };
          } else {
            new TRPCError({
              code: "NOT_FOUND",
              message: "Email or Password is invalid",
            });
          }
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.SECRET,
  session: {
    strategy: "jwt", // Use database for sessions
  },
  jwt: {
    secret: process.env.JWT_SECRET, // Ensure this secret is set
  },
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async jwt({ token, user }) {
      const dbUser = await prisma.user.findFirst({
        where: { email: token.email },
      });
      if (!dbUser) {
        // in case when user is new, thus not in db through tokens email
        if (user) {
          token.id = user?.id;
        }
        return token;
      }
      return {
        id: dbUser?.id,
        name: dbUser?.name,
        email: dbUser?.email,
        picture: dbUser?.image,
      };
    },
    async session({ session, token }) {
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
