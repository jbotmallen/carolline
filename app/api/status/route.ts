import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("email");
    console.log("Session cookie:", cookieStore.getAll());
    if (sessionCookie) {
      return NextResponse.json({ status: "authenticated", email: sessionCookie.value });
    }
    return NextResponse.json({ status: "unauthenticated" });
  } catch (error) {
    console.error("Error fetching session cookie:", error);
    return NextResponse.json({ status: "error", message: "Internal server error" });
  }
}
