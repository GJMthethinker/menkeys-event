import Link from "next/link";
import { createElement as h } from "react";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { getEventById } from "@/lib/data/events";
import { listTicketTypesByEvent } from "@/lib/data/tickets";
import { notFound } from "next/navigation";
import TicketsClient from "@/app/organizer/events/[id]/tickets/TicketsClient";

export default async function ManageTicketsPage({ params }: { params: { id: string } }) {
    const event = await getEventById(params.id);
    if (!event) notFound();

  const ticketTypes = await listTicketTypesByEvent(event.id);

  return h("main", { className: "min-h-screen px-5 sm:px-10 py-12" },
               h(Link, { href: "/organizer", className: "font-sans inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-muted hover:text-ivory" }, h(ArrowLeft, { size: 13 }), " Retour"),

               h("div", { className: "flex items-center justify-between flex-wrap gap-4 mt-6" },
                       h("div", {},
                                 h("p", { className: "font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-crimson" }, "Billetterie"),
                                 h("h1", { className: "font-display text-3xl sm:text-4xl mt-1" }, event.name),
                                 h("p", { className: "text-sm text-muted mt-1" }, event.date + " - " + event.venue + ", " + event.city)
                               ),
                       h(Link, { href: "/organizer/events/" + event.id + "/stats", className: "font-sans flex items-center gap-2 px-4 py-3 rounded-md border border-line hover:border-crimson" }, h(BarChart3, { size: 14 }), " STATISTIQUES"),
            ),                             

                       h(Link, { href: "/organizer/events/" + event.id + "/services", className: "font-sans flex items-center gap-2 px-4 py-3 rounded-md border border-line hover:border-crimson" }, "SERVICES MENKEYS"),
                       h(TicketsClient, { event, ticketTypes })
             );
}
