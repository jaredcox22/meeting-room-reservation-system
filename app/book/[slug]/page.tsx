import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { getRoomBySlug } from "@/lib/rooms";
import { BookingForm } from "@/components/book/booking-form";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const room = getRoomBySlug(slug);
  if (!room) return {};
  return {
    title: `Book — ${room.name}`,
    description: `Quick book ${room.name}`,
  };
}

export default async function BookPage({ params }: PageProps) {
  const { slug } = await params;
  const room = getRoomBySlug(slug);
  if (!room) notFound();
  const session = await getServerSession(authOptions);
  return <BookingForm room={room} session={session} />;
}
