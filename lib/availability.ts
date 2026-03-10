import type { Meeting, RoomStatus } from "@/components/kiosk/types";

export function getCurrentAndNext(
  meetings: Meeting[],
  nowMinutes: number
): { currentMeeting: Meeting | null; nextMeeting: Meeting | null } {
  let currentMeeting: Meeting | null = null;
  let nextMeeting: Meeting | null = null;
  for (const m of meetings) {
    if (m.startMinutes <= nowMinutes && nowMinutes < m.endMinutes) {
      currentMeeting = m;
    }
    if (m.startMinutes > nowMinutes && !nextMeeting) {
      nextMeeting = m;
    }
  }
  return { currentMeeting, nextMeeting };
}

function getRoomStatus(
  nowMinutes: number,
  currentMeeting: Meeting | null,
  _nextMeeting: Meeting | null
): RoomStatus {
  if (!currentMeeting) return "available";
  if (currentMeeting.endMinutes - nowMinutes <= 15) return "ending-soon";
  return "busy";
}

function getStatusLabel(
  status: RoomStatus,
  currentMeeting: Meeting | null,
  nextMeeting: Meeting | null
): string {
  if (status === "available") {
    return nextMeeting
      ? `Available Until ${nextMeeting.startTime}`
      : "Available All Day";
  }
  if (status === "ending-soon" && currentMeeting) {
    return `Ending Soon — Free at ${currentMeeting.endTime}`;
  }
  if (currentMeeting) {
    return `In Use Until ${currentMeeting.endTime}`;
  }
  return "";
}

export function getAvailability(
  meetings: Meeting[],
  nowMinutes: number
): {
  status: RoomStatus;
  label: string;
  currentMeeting: Meeting | null;
  nextMeeting: Meeting | null;
} {
  const { currentMeeting, nextMeeting } = getCurrentAndNext(meetings, nowMinutes);
  const status = getRoomStatus(nowMinutes, currentMeeting, nextMeeting);
  const label = getStatusLabel(status, currentMeeting, nextMeeting);
  return { status, label, currentMeeting, nextMeeting };
}
