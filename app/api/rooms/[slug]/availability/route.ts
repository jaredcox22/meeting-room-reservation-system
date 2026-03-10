import { NextResponse } from "next/server";
import { getRoomBySlug } from "@/lib/rooms";
import { getMockSchedule } from "@/lib/mock-schedule";
import { getAvailability } from "@/lib/availability";
import type { AvailabilityResponse } from "@/lib/api-types";

type RouteParams = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { slug } = await params;
  const room = getRoomBySlug(slug);
  if (!room) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const meetings = getMockSchedule(slug);
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const body: AvailabilityResponse = getAvailability(meetings, nowMinutes);
  return NextResponse.json(body);
}
