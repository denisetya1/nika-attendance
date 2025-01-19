import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./lib/db"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { loginSchema } from "./lib/zod/user"
import { compareSync } from "bcrypt-ts"
import { getToken } from "@auth/core/jwt"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validateFields = loginSchema.safeParse(credentials)

        if (!validateFields.success) {
          return null;
        }

        const { email, password } = validateFields.data;

        const user = await prisma.user.findUnique({
          where: {
            email
          }
        })

        if (!user) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          throw new Error("Invalid credentials.")
        }

        const isPasswordMatch = compareSync(password, user.password);

        if (!isPasswordMatch) {
          // Passwords don't match
          throw new Error("Invalid credentials.")
        }

        const {
          password: __, ...userWithoutPassword
        } = user;

        // return user object with their profile data
        return userWithoutPassword
      },
    }),
  ],
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = auth?.role === 'admin';

      const protectedRoute = [
        "/attendance",
      ];

      const adminRoute = [
        "/report/attendance"
      ]

      if (isLoggedIn && isAdmin && adminRoute.includes(nextUrl.pathname)) {
        return true;
      }

      if (isLoggedIn && !isAdmin && adminRoute.includes(nextUrl.pathname)) {
        return Response.redirect(new URL("/", nextUrl));
      }

      if (isLoggedIn && nextUrl.pathname.startsWith("/login")) {
        if (isAdmin)
          return Response.redirect(new URL("/report/attendance", nextUrl));
        else
          return Response.redirect(new URL("/attendance", nextUrl));
      }

      if (!isLoggedIn && (protectedRoute.includes(nextUrl.pathname)) || adminRoute.includes(nextUrl.pathname)) {
        return Response.redirect(new URL("/login", nextUrl));
      }

      return true
    },
    async session({ session, token }) {
      return { ...session, ...token }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },
  }
})