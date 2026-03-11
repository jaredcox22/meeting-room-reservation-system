import { NextResponse } from "next/server";
import { getRoomBySlug } from "@/lib/rooms";
import { getMockSchedule } from "@/lib/mock-schedule";
import { getRoomCalendarView, isGraphConfigured } from "@/lib/graph";
import { getDayBounds, minutesSinceMidnightInZone } from "@/lib/time";
import type { ScheduleResponse } from "@/lib/api-types";

type RouteParams = { params: Promise<{ slug: string }> };

const ROOM_TIMEZONE = process.env.ROOM_TIMEZONE?.trim() || "America/New_York";

export async function GET(_request: Request, { params }: RouteParams) {
  const { slug } = await params;
  const room = getRoomBySlug(slug);
  if (!room) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let meetings;
  if (!isGraphConfigured()) {
    meetings = getMockSchedule(slug);
  } else {
    try {
      const { start, end } = getDayBounds(new Date());
      meetings = await getRoomCalendarView(room.email, start, end);
    } catch (err) {
      console.warn("[schedule] using mock data (Graph failed):", err);
      meetings = getMockSchedule(slug);
    }
  }

  // Exclude meetings that have already ended (e.g. stopped early) so they don't appear in Today's Schedule
  const nowMinutes = minutesSinceMidnightInZone(new Date(), ROOM_TIMEZONE);
  const activeOrUpcoming = meetings.filter((m) => m.endMinutes > nowMinutes);

  const body: ScheduleResponse = { meetings: activeOrUpcoming };
  return NextResponse.json(body);
}
