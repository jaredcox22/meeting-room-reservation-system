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
  _nowMinutes: number,
  currentMeeting: Meeting | null,
  _nextMeeting: Meeting | null
): RoomStatus {
  return currentMeeting ? "busy" : "available";
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
