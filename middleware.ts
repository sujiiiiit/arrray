'use server'
import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseClient } from "@/supabase/server-client";
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const path = new URL(request.url).pathname;
  const user = await getUser(request, response);
  
  // Define protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/profile', '/settings', '/protected-route'];
  
  // Check if current path requires authentication
  if (protectedRoutes.some(route => path.startsWith(route)) && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

async function getUser(request: NextRequest, response: NextResponse) {
  const supabase = await createSupabaseClient();


  return (await supabase.auth.getUser()).data.user;
}
