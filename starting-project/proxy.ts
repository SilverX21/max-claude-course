import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get("better-auth.session_token");
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/authenticate", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/notes/:path*"],
};
