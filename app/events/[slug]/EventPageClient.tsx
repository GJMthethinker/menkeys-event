"use client";

import { useState, createElement as h } from "react";
import { Crown, MapPin, Calendar, Clock, Users, Check, ArrowRight, ArrowLeft, X, QrCode } from "lucide-react";
import type { EventRecord, TicketType, Ticket } from "@/lib/types";
import { purchaseTickets } from "@/app/events/actions";

function formatHTG(n: number) {
      return n.toLocaleString("fr-FR") + " HTG";
}

const MOIS = ["janvier","fevrier","mars","avril","mai","juin","juillet","aout","septembre","octobre","novembre","decembre"];

function formatDate(iso: string) {
      const parts = iso.split("-").map(Number);
      return parts[2] + " " + MOIS[parts[1] - 1] + " " + parts[0];
}

export default function EventPageClient({
      event,
      ticketTypes,
}: {
      event: EventRecord;
      ticketTypes: TicketType[];
}) {
      const [selected, setSelected] = useState<TicketType | null>(null);
      const [step, setStep] = useState(0);
      const [qty, setQty] = useState(1);
      const [form, setForm] = useState({ first: "", last: "", phone: "", email: "" });
      const [submitting, setSubmitting] = useState(false);
      const [error, setError] = useState<string | null>(null);
      const [issuedTickets, setIssuedTickets] = useState<Ticket[]>([]);

  function openCheckout(t: TicketType) {
          setSelected(t);
          setQty(1);
          setStep(0);
          setError(null);
  }

  function closeCheckout() {
          setSelected(null);
          setStep(0);
          setForm({ first: "", last: "", phone: "", email: "" });
          setIssuedTickets([]);
  }

  async function handleConfirm() {
          if (!selected) return;
          setSubmitting(true);
          setError(null);
          const result = await purchaseTickets({
                    eventId: event.id,
                    ticketTypeId: selected.id,
                    quantity: qty,
                    paymentMethod: "moncash",
                    participant: {
                                firstName: form.first,
                                lastName: form.last,
                                phone: form.phone,
                                email: form.email || undefined,
                    },
          });
          setSubmitting(false);
          if (!result.ok || !result.ticketsIssued) {
                    setError("Ce billet n'est plus disponible en quantite suffisante.");
                    return;
          }
          setIssuedTickets(result.ticketsIssued);
          setStep(3);
  }

  const heroChildren = [
          h("p", { key: "eyebrow", className: "font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-crimson" }, "The Menkeys Production presente"),
          h("h1", { key: "title", className: "font-display leading-[0.9] text-[15vw] sm:text-7xl mt-2" }, event.name),
          h("div", { key: "meta", className: "flex flex-wrap gap-x-8 gap-y-3 mt-8 text-sm" },
                  h("span", { className: "flex items-center gap-2" }, h(Calendar, { size: 16, className: "text-crimson" }), " " + formatDate(event.date)),
                  h("span", { className: "flex items-center gap-2" }, h(Clock, { size: 16, className: "text-crimson" }), " " + event.time),
                  h("span", { className: "flex items-center gap-2" }, h(MapPin, { size: 16, className: "text-crimson" }), " " + event.venue + ", " + event.city),
                  h("span", { className: "flex items-center gap-2" }, h(Users, { size: 16, className: "text-crimson" }), " " + event.capacity + " places")
                ),
          h("p", { key: "desc", className: "max-w-xl mt-6 text-sm leading-relaxed text-muted" }, event.description),
        ];

  const ticketCards = ticketTypes.map((t) => {
          const remaining = t.quantityTotal - t.quantitySold;
          const pct = t.quantityTotal > 0 ? Math.round((t.quantitySold / t.quantityTotal) * 100) : 0;
          return h("div", { key: t.id, className: "border border-line bg-surface p-6 flex flex-col justify-between" },
                         h("div", {},
                                   h("div", { className: "font-display text-2xl mb-4" }, t.name),
                                   h("div", { className: "font-display text-3xl mb-4" }, t.isFree ? "Gratuit" : formatHTG(t.price)),
                                   h("ul", { className: "space-y-2 mb-6" },
                                               t.perks.map((p) => h("li", { key: p, className: "flex items-start gap-2 text-xs text-muted" }, h(Check, { size: 13, className: "text-crimson mt-0.5 shrink-0" }), " " + p))
                                             ),
                                   h("div", { className: "mb-5" },
                                               h("div", { className: "flex justify-between text-[11px] text-muted mb-1" },
                                                             h("span", {}, remaining + " restants"),
                                                             h("span", {}, pct + "% vendu")
                                                           ),
                                               h("div", { className: "h-1 rounded-full overflow-hidden bg-line" },
                                                             h("div", { className: "h-full bg-crimson", style: { width: pct + "%" } })
                                                           )
                                             )
                                 ),
                         h("button", {
                                     onClick: () => openCheckout(t),
                                     disabled: remaining <= 0,
                                     className: "font-sans w-full py-3 rounded-md flex items-center justify-center gap-2 bg-crimson text-ivory hover:opacity-90 disabled:opacity-40",
                         }, (remaining <= 0 ? "EPUISE" : "ACHETER UN BILLET") + " ", h(ArrowRight, { size: 13 })));
  });

  const step0 = step === 0 && selected ? h("div", { key: "step0" },
                                               h("div", { className: "p-4 mb-5 flex items-center justify-between bg-surface-2 border border-line" },
                                                       h("div", {},
                                                                 h("div", { className: "font-display text-lg" }, selected.name),
                                                                 h("div", { className: "text-xs text-muted" }, selected.isFree ? "Gratuit" : formatHTG(selected.price) + " / billet")
                                                               ),
                                                       h("div", { className: "flex items-center gap-3" },
                                                                 h("button", { onClick: () => setQty((q) => Math.max(1, q - 1)), className: "w-8 h-8 rounded-full border border-line" }, "-"),
                                                                 h("span", { className: "w-5 text-center" }, qty),
                                                                 h("button", { onClick: () => setQty((q) => Math.min(10, q + 1)), className: "w-8 h-8 rounded-full border border-line" }, "+")
                                                               )
                                                     ),
                                               h("div", { className: "flex justify-between text-sm mb-8" },
                                                       h("span", { className: "text-muted" }, "Total"),
                                                       h("span", { className: "font-display text-xl" }, selected.isFree ? "Gratuit" : formatHTG(selected.price * qty))
                                                     ),
                                               h("button", { onClick: () => setStep(1), className: "font-sans w-full py-3 rounded-md bg-crimson text-ivory" }, "CONTINUER")
                                             ) : null;

  const step1 = step === 1 ? h("div", { key: "step1", className: "space-y-3" },
                                   h("div", {},
                                           h("label", { className: "text-[11px] text-muted" }, "Prenom"),
                                           h("input", { value: form.first, onChange: (e: any) => setForm({ ...form, first: e.target.value }), className: "w-full mt-1 px-3 py-2.5 rounded-md text-sm bg-surface-2 border border-line" })
                                         ),
                                   h("div", {},
                                           h("label", { className: "text-[11px] text-muted" }, "Nom"),
                                           h("input", { value: form.last, onChange: (e: any) => setForm({ ...form, last: e.target.value }), className: "w-full mt-1 px-3 py-2.5 rounded-md text-sm bg-surface-2 border border-line" })
                                         ),
                                   h("div", {},
                                           h("label", { className: "text-[11px] text-muted" }, "Telephone"),
                                           h("input", { value: form.phone, onChange: (e: any) => setForm({ ...form, phone: e.target.value }), className: "w-full mt-1 px-3 py-2.5 rounded-md text-sm bg-surface-2 border border-line" })
                                         ),
                                   h("div", {},
                                           h("label", { className: "text-[11px] text-muted" }, "Email (optionnel)"),
                                           h("input", { value: form.email, onChange: (e: any) => setForm({ ...form, email: e.target.value }), className: "w-full mt-1 px-3 py-2.5 rounded-md text-sm bg-surface-2 border border-line" })
                                         ),
                                   h("div", { className: "flex gap-3 pt-4" },
                                           h("button", { onClick: () => setStep(0), className: "py-3 px-4 rounded-md border border-line" }, h(ArrowLeft, { size: 13 })),
                                           h("button", {
                                                       disabled: !form.first || !form.last || !form.phone,
                                                       onClick: () => setStep(2),
                                                       className: "font-sans flex-1 py-3 rounded-md bg-crimson text-ivory disabled:opacity-40",
                                           }, "CONTINUER")
                                         )
                                 ) : null;

  const step2 = step === 2 && selected ? h("div", { key: "step2" },
                                               h("div", { className: "p-4 mb-5 text-sm space-y-2 bg-surface-2 border border-line" },
                                                       h("div", { className: "flex justify-between" },
                                                                 h("span", { className: "text-muted" }, qty + " x " + selected.name),
                                                                 h("span", {}, selected.isFree ? "Gratuit" : formatHTG(selected.price * qty))
                                                               )
                                                     ),
                                               error ? h("p", { className: "text-xs text-crimson mb-4" }, error) : null,
                                               h("div", { className: "flex gap-3" },
                                                       h("button", { onClick: () => setStep(1), className: "py-3 px-4 rounded-md border border-line" }, h(ArrowLeft, { size: 13 })),
                                                       h("button", {
                                                                   disabled: submitting,
                                                                   onClick: handleConfirm,
                                                                   className: "font-sans flex-1 py-3 rounded-md bg-crimson text-ivory disabled:opacity-40",
                                                       }, submitting ? "..." : "PAYER")
                                                     )
                                             ) : null;

  const step3 = step === 3 && issuedTickets.length > 0 && selected ? h("div", { key: "step3" },
                                                                           h("div", { className: "flex items-center gap-2 mb-6 text-xs text-gold" }, h(Check, { size: 14 }), " Paiement confirme"),
                                                                           h("div", { className: "bg-surface-2 border border-line p-5" },
                                                                                   h("p", { className: "font-sans text-[11px] text-crimson" }, "Menkeys Event"),
                                                                                   h("h4", { className: "font-display text-2xl mt-1" }, event.name),
                                                                                   h("p", { className: "text-xs mt-1", style: { color: "#c9a227" } }, selected.name),
                                                                                   h("div", { className: "mt-4 text-xs text-muted" }, form.first + " " + form.last),
                                                                                   h("div", { className: "mt-4 space-y-2" },
                                                                                             issuedTickets.map((tk) => h("div", { key: tk.id, className: "flex items-center justify-between border-t border-line pt-2" },
                                                                                                                                   h("span", { className: "font-display text-sm" }, tk.code),
                                                                                                                                   h("span", { className: "flex items-center gap-1 text-[11px] text-gold" }, h(QrCode, { size: 12 }), " Valide")
                                                                                                                                 ))
                                                                                           )
                                                                                 ),
                                                                           h("button", { onClick: closeCheckout, className: "font-sans w-full py-3 rounded-md mt-6 border border-ivory" }, "FERMER")
                                                                         ) : null;

  const modal = selected ? h("div", { className: "fixed inset-0 z-30 flex items-center justify-center p-4", style: { background: "rgba(10,10,10,0.92)" } },
                                 h("div", { className: "w-full sm:max-w-md max-h-[92vh] overflow-y-auto p-6 sm:p-8 relative bg-surface border border-line" },
                                         h("button", { onClick: closeCheckout, className: "absolute top-5 right-5 p-1 rounded-full border border-line" }, h(X, { size: 16 })),
                                         h("p", { className: "font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-crimson mb-1" }, event.name),
                                         h("h3", { className: "font-display text-2xl mb-6" }, step === 3 ? "Ton billet" : "Reservation"),
                                         step0,
                                         step1,
                                         step2,
                                         step3
                                       )
                               ) : null;

  return h("div", { className: "min-h-screen" },
               h("section", { className: "relative px-5 sm:px-10 pt-16 pb-10" }, heroChildren),
               h("section", { className: "px-5 sm:px-10 py-12" },
                       h("p", { className: "font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-muted mb-2" }, "Billetterie"),
                       h("h2", { className: "font-display text-3xl sm:text-4xl mb-8" }, "Choisis ton acces"),
                       h("div", { className: "grid sm:grid-cols-3 gap-5" }, ticketCards)
                     ),
               modal
             );
}
