"use client";

import { useState, createElement as h } from "react";
import { useRouter } from "next/navigation";
import { createTicketTypeAction, publishEventAction } from "@/app/organizer/actions";
import type { EventRecord, TicketType } from "@/lib/types";

function formatHTG(n: number) {
    return n.toLocaleString("fr-FR") + " HTG";
}

export default function TicketsClient({ event, ticketTypes }: { event: EventRecord; ticketTypes: TicketType[] }) {
    const router = useRouter();
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(100);
    const [perks, setPerks] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [publishing, setPublishing] = useState(false);

  async function handleAdd() {
        if (!name || quantity <= 0) return;
        setSubmitting(true);
        await createTicketTypeAction({
                eventId: event.id,
                name,
                price,
                currency: "HTG",
                quantityTotal: quantity,
                perks: perks.split(",").map((p) => p.trim()).filter(Boolean),
                isFree: price === 0,
        });
        setSubmitting(false);
        setName("");
        setPrice(0);
        setQuantity(100);
        setPerks("");
        router.refresh();
  }

  async function handlePublish() {
        setPublishing(true);
        await publishEventAction(event.id);
        setPublishing(false);
        router.refresh();
  }

  return h("div", { className: "mt-10 grid gap-10 lg:grid-cols-2" },
               h("div", {},
                       h("div", { className: "flex items-center justify-between mb-4" },
                                 h("p", { className: "font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-muted" }, "Categories existantes (" + ticketTypes.length + ")"),
                                     ticketTypes.length === 0 && event.status !== "published" && h("p", { className: "text-xs text-muted mb-3" }, "Ajoute au moins une categorie de billet avant de publier."),
                                 event.status !== "published" && h("button", {
                                             onClick: handlePublish,
                                             disabled: publishing || ticketTypes.length === 0,
                                             className: "font-sans px-4 py-2 rounded-md text-[11px] uppercase bg-crimson text-ivory disabled:opacity-40",
                                 }, publishing ? "..." : "PUBLIER L'EVENEMENT")
                               ),
                       ticketTypes.length === 0
                         ? h("div", { className: "border border-dashed border-line p-8 text-center text-sm text-muted" }, "Aucune categorie pour le moment.")
                         : h("div", { className: "space-y-3" },
                                         ticketTypes.map((t) => h("div", { key: t.id, className: "clip-corner-tr flex items-center justify-between border border-line bg-surface p-5" },
                                                                                h("div", {},
                                                                                                  h("div", { className: "font-display text-lg" }, t.name),
                                                                                                  h("div", { className: "text-xs text-muted mt-1" }, t.quantitySold + " / " + t.quantityTotal + " vendus")
                                                                                                ),
                                                                                h("div", { className: "font-display text-lg" }, t.isFree ? "Gratuit" : formatHTG(t.price))
                                                                              ))
                                       )
                     ),

               h("div", {},
                       h("p", { className: "font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-muted mb-4" }, "Ajouter une categorie"),
                       h("div", { className: "space-y-3" },
                                 h("div", {},
                                             h("label", { className: "text-[11px] uppercase text-muted" }, "Nom"),
                                             h("input", { value: name, onChange: (e: any) => setName(e.target.value), placeholder: "Ex: VIP", className: "w-full mt-1 px-3 py-2.5 rounded-md text-sm bg-surface border border-line text-ivory outline-none" })
                                           ),
                                 h("div", { className: "grid grid-cols-2 gap-3" },
                                             h("div", {},
                                                           h("label", { className: "text-[11px] uppercase text-muted" }, "Prix (HTG)"),
                                                           h("input", { type: "number", value: price, onChange: (e: any) => setPrice(Number(e.target.value)), className: "w-full mt-1 px-3 py-2.5 rounded-md text-sm bg-surface border border-line text-ivory outline-none" })
                                                         ),
                                             h("div", {},
                                                           h("label", { className: "text-[11px] uppercase text-muted" }, "Quantite"),
                                                           h("input", { type: "number", value: quantity, onChange: (e: any) => setQuantity(Number(e.target.value)), className: "w-full mt-1 px-3 py-2.5 rounded-md text-sm bg-surface border border-line text-ivory outline-none" })
                                                         )
                                           ),
                                 h("div", {},
                                             h("label", { className: "text-[11px] uppercase text-muted" }, "Avantages (separes par des virgules)"),
                                             h("input", { value: perks, onChange: (e: any) => setPerks(e.target.value), placeholder: "Acces prioritaire, 1 boisson offerte", className: "w-full mt-1 px-3 py-2.5 rounded-md text-sm bg-surface border border-line text-ivory outline-none" })
                                           ),
                                 h("button", {
                                             onClick: handleAdd,
                                             disabled: submitting,
                                             className: "font-sans w-full py-3 rounded-md bg-crimson text-ivory disabled:opacity-50",
                                 }, submitting ? "..." : "AJOUTER CETTE CATEGORIE")
                               )
                     )
             );
}
