import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  const token = await getToken({req , secret:process.env.JWT_SECRET})
  if(!token){
    return NextResponse.redirect(new URL('/login' , req.url))
  }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/:path'],
}