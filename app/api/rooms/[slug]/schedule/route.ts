import { NextResponse } from "next/server";
import { getRoomBySlug } from "@/lib/rooms";
import { getMockSchedule } from "@/lib/mock-schedule";
import { getRoomCalendarView, isGraphConfigured } from "@/lib/graph";
import { getDayBounds } from "@/lib/time";
import type { ScheduleResponse } from "@/lib/api-types";

type RouteParams = { params: Promise<{ slug: string }> };

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

  const body: ScheduleResponse = { meetings };
  return NextResponse.json(body);
}
