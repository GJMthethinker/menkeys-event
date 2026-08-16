import Link from "next/link";
import { createElement as h } from "react";
import { ArrowLeft } from "lucide-react";
import { getEventById } from "@/lib/data/events";
import { notFound } from "next/navigation";
import ServicesClient from "@/app/organizer/events/[id]/services/ServicesClient";
import { requireOrganizer } from "@/lib/auth";

export default async function EventServicesPage({ params }: { params: { id: string } }) {
    const event = await getEventById(params.id);
    if (!event) notFound();
        const organizerId = await requireOrganizer();
        if (event.organizerId !== organizerId) notFound();

  return h("main", { className: "min-h-screen px-5 sm:px-10 py-12" },
               h(Link, { href: "/organizer/events/" + event.id + "/tickets", className: "font-sans inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-muted hover:text-ivory" }, h(ArrowLeft, { size: 13 }), " Retour a la billetterie"),

               h("p", { className: "mt-6 font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-crimson" }, "Services Menkeys Event"),
               h("h1", { className: "mt-1 font-display text-3xl sm:text-4xl" }, event.name),
               h("p", { className: "mt-2 max-w-lg text-sm text-muted" }, "Demande des billets physiques ou des agents pour ton evenement. Nous te contactons directement pour finaliser."),

               h(ServicesClient, { event })
             );
}
