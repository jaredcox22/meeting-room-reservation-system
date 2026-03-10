import type { Meeting, RoomStatus } from "@/components/kiosk/types";

export type { Meeting, RoomStatus };

export interface ScheduleResponse {
  meetings: Meeting[];
}

export interface AvailabilityResponse {
  status: RoomStatus;
  label: string;
  currentMeeting: Meeting | null;
  nextMeeting: Meeting | null;
}

export interface ReserveRequest {
  durationMinutes: number;
  title?: string;
}

export interface ReserveResponse {
  success: true;
  eventId?: string;
}

export interface ApiErrorResponse {
  error: string;
}
