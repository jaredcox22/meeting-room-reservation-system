import { NextResponse } from "next/server";
import { getRoomBySlug } from "@/lib/rooms";
import type { ReserveRequest, ReserveResponse } from "@/lib/api-types";

const VALID_DURATIONS = [15, 30, 45, 60] as const;

type RouteParams = { params: Promise<{ slug: string }> };

function parseBody(body: unknown): ReserveRequest | null {
  if (!body || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  const durationMinutes = o.durationMinutes;
  if (
    typeof durationMinutes !== "number" ||
    !VALID_DURATIONS.includes(durationMinutes as (typeof VALID_DURATIONS)[number])
  ) {
    return null;
  }
  const title =
    o.title === undefined || o.title === null
      ? undefined
      : typeof o.title === "string"
        ? o.title
        : undefined;
  return { durationMinutes: durationMinutes as number, title };
}

export async function POST(request: Request, { params }: RouteParams) {
  const { slug } = await params;
  const room = getRoomBySlug(slug);
  if (!room) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }
  const parsed = parseBody(body);
  if (!parsed) {
    return NextResponse.json(
      { error: "durationMinutes must be 15, 30, 45, or 60" },
      { status: 400 }
    );
  }
  const response: ReserveResponse = { success: true };
  return NextResponse.json(response, { status: 201 });
}
