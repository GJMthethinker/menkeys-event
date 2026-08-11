import { listPublishedEvents } from "@/lib/data/events";
import { listTicketTypesByEvent } from "@/lib/data/tickets";
import DiscoverClient from "@/app/discover/DiscoverClient";

export default async function DiscoverPage() {
    const events = await listPublishedEvents();

  const eventsWithPrice = await Promise.all(
        events.map(async (event) => {
                const ticketTypes = await listTicketTypesByEvent(event.id);
                const prices = ticketTypes.map((t) => t.price);
                const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
                return { event, minPrice };
        })
      );

  return <DiscoverClient items={eventsWithPrice} />;
}
