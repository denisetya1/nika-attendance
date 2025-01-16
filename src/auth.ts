import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./lib/db"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { loginSchema } from "./lib/zod/user"
import { compareSync } from "bcrypt-ts"

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
          password: __, ...userWithPassword
        } = user;

        // return user object with their profile data
        return userWithPassword
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      console.log(auth)
      const isLoggedIn = !!auth?.user;
      const protectedRoute = [
        "/attendance",
        "/dashboard"
      ];

      if (!isLoggedIn && protectedRoute.includes(nextUrl.pathname)) {
        return Response.redirect(new URL("/login", nextUrl));
      }

      if (isLoggedIn && nextUrl.pathname.startsWith("/login")) {
        return Response.redirect(new URL("/attendance", nextUrl));
      }

      return true
    }
  }
})