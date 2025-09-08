import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const session = req.cookies.get("pfa_session")?.value;
  const isAuthPage =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/register");
  if (
    !session &&
    !isAuthPage &&
    (req.nextUrl.pathname.startsWith("/dashboard") ||
      req.nextUrl.pathname.startsWith("/transactions"))
  ) {
    const url = new URL("/login", req.url);
    return NextResponse.redirect(url);
  }
  if (session && isAuthPage) {
    const url = new URL("/dashboard", req.url);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/transactions/:path*", "/login", "/register"],
};
