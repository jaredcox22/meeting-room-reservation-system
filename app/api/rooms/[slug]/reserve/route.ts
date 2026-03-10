import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getRoomBySlug } from "@/lib/rooms";
import { getRoomCalendarView, createRoomReservation, isGraphConfigured } from "@/lib/graph";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Sign in required" },
      { status: 401 }
    );
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

  const now = new Date();
  const start = new Date(now);
  const end = new Date(now.getTime() + parsed.durationMinutes * 60 * 1000);

  let eventId: string | undefined;
  if (isGraphConfigured()) {
    try {
      const meetings = await getRoomCalendarView(room.email, start, end);
      if (meetings.length > 0) {
        return NextResponse.json(
          { error: "Room is not available for that time." },
          { status: 409 }
        );
      }

      const result = await createRoomReservation(
        room.email,
        start,
        end,
        parsed.title ?? "Quick booking",
        session.user.email
      );
      eventId = result.eventId;
    } catch (err) {
      console.error("[reserve] createRoomReservation failed:", err);
      return NextResponse.json(
        { error: "Could not create reservation. Please try again." },
        { status: 502 }
      );
    }
  }

  const response: ReserveResponse = { success: true, ...(eventId && { eventId }) };
  return NextResponse.json(response, { status: 201 });
}
