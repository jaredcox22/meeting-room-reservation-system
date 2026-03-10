import { NextResponse } from "next/server";
import { getRoomBySlug } from "@/lib/rooms";
import { getMockSchedule } from "@/lib/mock-schedule";
import type { ScheduleResponse } from "@/lib/api-types";

type RouteParams = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { slug } = await params;
  const room = getRoomBySlug(slug);
  if (!room) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const meetings = getMockSchedule(slug);
  const body: ScheduleResponse = { meetings };
  return NextResponse.json(body);
}
