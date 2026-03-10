import { NextResponse } from "next/server";
import { getDirectoryUsers } from "@/lib/graph";

export async function GET() {
  try {
    const users = await getDirectoryUsers();
    return NextResponse.json({ users });
  } catch (err) {
    console.error("[directory/users]", err);
    const message = err instanceof Error ? err.message : "Failed to load users";
    const status = message.includes("403") || message.includes("permission") ? 403 : 500;
    return NextResponse.json(
      {
        error: "Failed to load users",
        hint: message,
      },
      { status }
    );
  }
}
