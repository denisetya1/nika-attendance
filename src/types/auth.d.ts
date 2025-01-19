import NextAuth, { type DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    id?: string,
    role?: string,
    user: {
      role?: string
    } & DefaultSession["user"] & DefaultUser
  }

  interface User {
    id: string
    name: string
    email: string
    role: string
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    id: string
    name: string
    email: string
    role: string
  }
}