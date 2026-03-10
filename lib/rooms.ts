export type Room = {
  slug: string;
  name: string;
  email: string;
  bookingPath: string;
  displayPath: string;
};

const ROOMS: Record<string, Room> = {
  canvass: {
    slug: "canvass",
    name: "Canvass Room",
    email: "canvassroom@ircuwd.com",
    bookingPath: "/book/canvass",
    displayPath: "/rooms/canvass",
  },
  sales: {
    slug: "sales",
    name: "Sales Room",
    email: "salesroom@ircuwd.com",
    bookingPath: "/book/sales",
    displayPath: "/rooms/sales",
  },
};

export const ROOM_SLUGS = Object.keys(ROOMS) as string[];

export function getRoomBySlug(slug: string): Room | undefined {
  return ROOMS[slug];
}

export function getRoomSlugs(): string[] {
  return ROOM_SLUGS;
}
