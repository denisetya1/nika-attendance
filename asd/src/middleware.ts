import { withAuth } from "next-auth/middleware"

export default withAuth(
  {
    callbacks: {
      authorized: async ({ req, token }) => {
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/((?!api|login|signout|_next/static|_next/image).*)',
  ]
}

