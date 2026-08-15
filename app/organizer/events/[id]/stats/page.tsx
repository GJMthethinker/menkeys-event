import Link from "next/link";
import { createElement as h } from "react";
import { ArrowLeft, Ticket, Wallet, Users, DoorOpen } from "lucide-react";
import { getEventById } from "@/lib/data/events";
import { listTicketTypesByEvent } from "@/lib/data/tickets";
import { listTicketsByEvent } from "@/lib/data/orders";
import { notFound } from "next/navigation";

function formatHTG(n: number) {
    return n.toLocaleString("fr-FR") + " HTG";
}

function StatCard(props: { icon: any; label: string; value: string; sub?: string }) {
    return h("div", { className: "clip-corner-tr border border-line bg-surface p-5" },
                 h("div", { className: "flex items-center gap-2 text-muted mb-3" },
                         h(props.icon, { size: 14 }),
                         h("span", { className: "font-sans text-[11px] font-bold uppercase tracking-[0.15em]" }, props.label)
                       ),
                 h("div", { className: "font-display text-3xl" }, props.value),
                 props.sub && h("div", { className: "text-xs text-muted mt-1" }, props.sub)
               );
}

export default async function EventStatsPage({ params }: { params: { id: string } }) {
    const event = await getEventById(params.id);
    if (!event) notFound();

  const ticketTypes = await listTicketTypesByEvent(event.id);
    const tickets = await listTicketsByEvent(event.id);

  const totalSold = ticketTypes.reduce((sum, t) => sum + t.quantitySold, 0);
    const totalRevenue = ticketTypes.reduce((sum, t) => sum + t.price * t.quantitySold, 0);
    const fillRate = event.capacity > 0 ? Math.round((totalSold / event.capacity) * 100) : 0;
    const usedCount = tickets.filter((t) => t.status === "used").length;
    const presenceRate = totalSold > 0 ? Math.round((usedCount / totalSold) * 100) : 0;

  return h("main", { className: "min-h-screen px-5 sm:px-10 py-12" },
               h(Link, { href: "/organizer/events/" + event.id + "/tickets", className: "font-sans inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-muted hover:text-ivory" }, h(ArrowLeft, { size: 13 }), " Retour a la billetterie"),

               h("p", { className: "mt-6 font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-crimson" }, "Statistiques"),
               h("h1", { className: "mt-2 font-display text-3xl uppercase sm:text-5xl" }, event.name),

               h("div", { className: "grid gap-4 sm:grid-cols-4 mt-8" },
                       h(StatCard, { icon: Wallet, label: "Revenus", value: formatHTG(totalRevenue) }),
                       h(StatCard, { icon: Ticket, label: "Billets vendus", value: String(totalSold), sub: "sur " + event.capacity + " places" }),
                       h(StatCard, { icon: Users, label: "Taux de remplissage", value: fillRate + "%" }),
                       h(StatCard, { icon: DoorOpen, label: "Taux de presence", value: presenceRate + "%", sub: usedCount + " entrees scannees" })
                     ),

               h("div", { className: "mt-10" },
                       h("p", { className: "font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-muted mb-4" }, "Ventes par categorie"),
                       h("div", { className: "border border-line divide-y divide-line" },
                                 ticketTypes.map((t) => {
                                             const pct = t.quantityTotal > 0 ? Math.round((t.quantitySold / t.quantityTotal) * 100) : 0;
                                             return h("div", { key: t.id, className: "p-4 flex items-center justify-between bg-surface" },
                                                                  h("div", {},
                                                                                  h("div", { className: "font-display text-lg" }, t.name),
                                                                                  h("div", { className: "text-xs text-muted mt-1" }, t.quantitySold + " / " + t.quantityTotal + " vendus (" + pct + "%)")
                                                                                ),
                                                                  h("div", { className: "font-display text-xl" }, t.isFree ? "Gratuit" : formatHTG(t.price * t.quantitySold))
                                                                );
                                 })
                               )
                     )
             );
}
