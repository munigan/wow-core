import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const authRoutes = ["/sign-in", "/sign-up"];

export default async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	// Authenticated users should not see auth pages
	if (authRoutes.includes(pathname) && session) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	// Unauthenticated users can only access auth pages and API
	if (!session && !authRoutes.includes(pathname)) {
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|dev|favicon.ico).*)"],
};
