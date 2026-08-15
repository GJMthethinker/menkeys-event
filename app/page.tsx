import Link from "next/link";
import { createElement as h } from "react";
import { Crown, Compass, ArrowRight } from "lucide-react";
import { listPublishedEvents } from "@/lib/data/events";
import { listTicketTypesByEvent } from "@/lib/data/tickets";

const MOIS = ["janvier","fevrier","mars","avril","mai","juin","juillet","aout","septembre","octobre","novembre","decembre"];

function formatDate(iso: string) {
    const parts = iso.split("-").map(Number);
    return parts[2] + " " + MOIS[parts[1] - 1] + " " + parts[0];
}

function formatHTG(n: number) {
    return n.toLocaleString("fr-FR") + " HTG";
}

export default async function Home() {
    const events = await listPublishedEvents();
    const featured = events.slice(0, 3);

  const withPrices = await Promise.all(
        featured.map(async (event) => {
                const ticketTypes = await listTicketTypesByEvent(event.id);
                const prices = ticketTypes.map((t) => t.price);
                const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
                return { event, minPrice };
        })
      );

  return h("main", { className: "min-h-screen" },
               h("section", { className: "px-5 sm:px-10 pt-24 pb-16 text-center" },
                       h("p", { className: "font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-crimson" }, "The Menkeys Production presente"),
                       h("h1", { className: "mt-3 font-display text-6xl uppercase sm:text-8xl" }, "Menkeys Event"),
                       h("p", { className: "mt-5 max-w-xl mx-auto text-sm text-muted leading-relaxed" },
                                 "La billetterie qui donne vie aux evenements haitiens. Trouve ton prochain sortie, ou lance la billetterie du tien."
                               ),
                       h("div", { className: "mt-8 flex flex-wrap justify-center gap-4" },
                                 h(Link, {
                                             href: "/discover",
                                             className: "font-sans flex items-center gap-2 px-6 py-3 rounded-md bg-crimson text-ivory",
                                 }, h(Compass, { size: 15 }), " DECOUVRIR LES EVENEMENTS"),
                                 h(Link, {
                                             href: "/organizer",
                                             className: "font-sans flex items-center gap-2 px-6 py-3 rounded-md border border-line hover:border-crimson",
                                 }, h(Crown, { size: 15 }), " ESPACE ORGANISATEUR")
                               )
                     ),

               withPrices.length > 0 && h("section", { className: "px-5 sm:px-10 pb-20" },
                                                h("div", { className: "flex items-center justify-between mb-6" },
                                                          h("p", { className: "font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-muted" }, "A la une"),
                                                          h(Link, { href: "/discover", className: "font-sans flex items-center gap-1 text-[11px] uppercase text-crimson" }, "Voir tout ", h(ArrowRight, { size: 12 }))
                                                        ),
                                                h("div", { className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3" },
                                                          withPrices.map(({ event, minPrice }) => h(Link, {
                                                                      key: event.id,
                                                                      href: "/events/" + event.slug,
                                                                      className: "clip-corner-tr block border border-line bg-surface p-5 hover:border-crimson",
                                                          },
                                                                                                              h("h2", { className: "font-display text-2xl" }, event.name),
                                                                                                              h("p", { className: "mt-2 text-xs text-muted" }, formatDate(event.date) + " - " + event.venue + ", " + event.city),
                                                                                                              h("p", { className: "mt-4 font-display text-lg" }, minPrice === 0 ? "Gratuit" : "A partir de " + formatHTG(minPrice))
                                                                                                            ))
                                                        )
                                              )
             );
}
