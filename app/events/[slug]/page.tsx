import { getEventBySlug } from "@/lib/data/events";
import { listTicketTypesByEvent } from "@/lib/data/tickets";
import EventPageClient from "@/app/events/[slug]/EventPageClient";
import { notFound } from "next/navigation";

export default async function EventPage({ params }: { params: { slug: string } }) {
    const event = await getEventBySlug(params.slug);
    if (!event || event.status !== "published") notFound();

  const ticketTypes = await listTicketTypesByEvent(event.id);

  return EventPageClient({ event, ticketTypes });
}
