import { createServerClient } from "@supabase/ssr";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_PROJECT_URL!,
    process.env.NEXT_PUBLIC_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const authPaths = ["/login", "/signup"];
  const publicPaths = [...authPaths, "/"];
  const isPublicPath = publicPaths.some((path) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path),
  );
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  //if not logged in and trying to access protected path
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    console.log("not logged in and trying to access protected path");
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  //if logged in and trying to access /login or /signup -> redirect to dashboard
  if (user && isAuthPath) {
    const url = request.nextUrl.clone();
    console.log("logged in and trying to access login and signup");
    url.pathname = "/todo";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
