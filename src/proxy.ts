import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/session";

const SESSION_COOKIE = "ideora_session";
const LOGIN_ROUTE = "/login";
// Read-only pages opened by a private share link: the token in the URL is checked by the page itself.
const SHARE_PREFIX = "/partage/";

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith(SHARE_PREFIX)) {
    const res = NextResponse.next();
    res.headers.set("Referrer-Policy", "no-referrer");
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }
  const isPublicRoute = pathname.startsWith(LOGIN_ROUTE);

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const isAuthenticated = await verifySessionToken(token);

  if (!isPublicRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
