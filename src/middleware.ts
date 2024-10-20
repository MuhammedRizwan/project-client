import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const userToken = request.cookies.get("accessToken")?.value;
  const adminToken = request.cookies.get("adminToken")?.value;
  const agentToken = request.cookies.get("agentToken")?.value;

  const url = request.nextUrl.clone();

  const isUserAuthRoute =
    url.pathname === "/login" ||
    url.pathname === "/signup" ||
    url.pathname === "/verification" ||
    url.pathname === "/forget-password";

    const isAgentAuthRoute =
      url.pathname === "/agent" ||
      url.pathname === "/agent/signup" ||
      url.pathname === "/agent/verification" ||
      url.pathname === "/agent/forget-password";

  const isAdminAuthRoute = request.nextUrl.pathname.startsWith("/admin");
    if (userToken && isUserAuthRoute) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (adminToken && isAdminAuthRoute) {
    url.pathname = "/admin/dashboard";
    return NextResponse.redirect(url);
  }

  if (agentToken && isAgentAuthRoute) {
    url.pathname = "/agent/Dashboard";
    return NextResponse.redirect(url);
  }
}
export const config = {
  matcher: [
    "/login",
    "/signup",
    "/verification",
    "/forget-password",
    "/admin",
    "/agent",
    "/agent/signup",
    "/agent/verification",
    "/agent/forget-password",
  ],
};



