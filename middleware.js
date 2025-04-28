import { NextResponse } from "next/server";
import { verifyJWT } from "./lib/auth";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname === "/userpanel") {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    try {
      await verifyJWT(token);
      // if valid, let the request continue
      return NextResponse.next();
    } catch (err) {
      // expired / malformed → redirect to signin
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }
}
