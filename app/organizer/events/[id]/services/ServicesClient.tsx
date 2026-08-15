"use client";

import { useState, createElement as h } from "react";
import { Ticket, ScanLine, ShieldCheck, MessageCircle } from "lucide-react";
import { requestServiceAction } from "@/app/organizer/actions";
import type { EventRecord, ServiceType } from "@/lib/types";

const MENKEYS_WHATSAPP = "50941650486";

const SERVICE_TYPES: { value: ServiceType; label: string; description: string; icon: any }[] = [
  { value: "physical_tickets", label: "Billets physiques", description: "Billets imprimes avec QR code unique, livres par notre equipe", icon: Ticket },
  { value: "scan_agents", label: "Agents de scan", description: "Nos agents gerent le controle d'entree a ta place", icon: ScanLine },
  { value: "security_agents", label: "Agents de securite", description: "Brigade pour la securite et la gestion de ton evenement", icon: ShieldCheck },
  ];

export default function ServicesClient({ event }: { event: EventRecord }) {
    const [type, setType] = useState<ServiceType>("physical_tickets");
    const [quantity, setQuantity] = useState(100);
    const [contactName, setContactName] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [notes, setNotes] = useState("");
      const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [sentUrl, setSentUrl] = useState<string | null>(null);

  async function handleSubmit() {
                setError(null);
            if (!contactName || !contactPhone) {
                          setError("Merci de remplir ton nom et ton telephone.");
                          return;
            }
            if (quantity <= 0) {
                          setError("La quantite doit etre superieure a 0.");
                          return;
            }
        setSubmitting(true);

      await requestServiceAction({
              eventId: event.id,
              organizerId: event.organizerId,
              type,
              quantity,
              contactName,
              contactPhone,
              notes: notes || undefined,
      });

      const label = SERVICE_TYPES.find((s) => s.value === type)?.label ?? type;
        const lines = [
                "Nouvelle demande Menkeys Event",
                "Evenement: " + event.name,
                "Service: " + label,
                "Quantite: " + quantity,
                "Contact: " + contactName + " - " + contactPhone,
                notes ? "Notes: " + notes : "",
              ].filter(Boolean).join("\n");

      const url = "https://wa.me/" + MENKEYS_WHATSAPP + "?text=" + encodeURIComponent(lines);
        setSubmitting(false);
        setSentUrl(url);
        window.open(url, "_blank");
  }

  return h("div", { className: "mt-10 grid gap-10 lg:grid-cols-2 max-w-4xl" },
               h("div", {},
                       h("p", { className: "font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-muted mb-4" }, "Type de service"),
                       h("div", { className: "space-y-3" },
                                 SERVICE_TYPES.map((s) => h("button", {
                                             key: s.value,
                                             onClick: () => setType(s.value),
                                             className: "w-full text-left flex items-start gap-3 p-4 rounded-md border",
                                             style: {
                                                           borderColor: type === s.value ? "#e31b23" : "#2c2a27",
                                                           background: type === s.value ? "rgba(227,27,35,0.08)" : "transparent",
                                             },
                                 },
                                                                      h(s.icon, { size: 18, className: "mt-0.5 text-crimson shrink-0" }),
                                                                      h("div", {},
                                                                                    h("div", { className: "font-display text-lg" }, s.label),
                                                                                    h("div", { className: "text-xs text-muted mt-1" }, s.description)
                                                                                  )
                                                                    ))
                               )
                     ),

               h("div", {},
                       sentUrl
                         ? h("div", { className: "border border-line bg-surface p-6" },
                                         h(MessageCircle, { size: 28, className: "text-crimson mb-3" }),
                                         h("p", { className: "font-display text-xl mb-2" }, "Demande envoyee"),
                                         h("p", { className: "text-sm text-muted mb-4" }, "Ta demande a ete enregistree. Si WhatsApp ne s'est pas ouvert automatiquement, clique ci-dessous."),
                                         h("a", { href: sentUrl, target: "_blank", className: "font-sans inline-flex items-center gap-2 px-5 py-3 rounded-md bg-crimson text-ivory" }, h(MessageCircle, { size: 14 }), " OUVRIR WHATSAPP")
                                       )
                         : h("div", { className: "space-y-4" },
                                         h("div", {},
                                                         h("label", { className: "text-[11px] uppercase text-muted" }, "Quantite"),
                                                         h("input", { type: "number", value: quantity, onChange: (e: any) => setQuantity(Number(e.target.value)), className: "w-full mt-1 px-3 py-2.5 rounded-md text-sm bg-surface border border-line text-ivory outline-none" })
                                                       ),
                                         h("div", {},
                                                         h("label", { className: "text-[11px] uppercase text-muted" }, "Ton nom"),
                                                         h("input", { value: contactName, onChange: (e: any) => setContactName(e.target.value), className: "w-full mt-1 px-3 py-2.5 rounded-md text-sm bg-surface border border-line text-ivory outline-none" })
                                                       ),
                                         h("div", {},
                                                         h("label", { className: "text-[11px] uppercase text-muted" }, "Ton telephone"),
                                                         h("input", { value: contactPhone, onChange: (e: any) => setContactPhone(e.target.value), placeholder: "36001122", className: "w-full mt-1 px-3 py-2.5 rounded-md text-sm bg-surface border border-line text-ivory outline-none" })
                                                       ),
                                         h("div", {},
                                                         h("label", { className: "text-[11px] uppercase text-muted" }, "Notes (optionnel)"),
                                                         h("textarea", { value: notes, onChange: (e: any) => setNotes(e.target.value), rows: 3, className: "w-full mt-1 px-3 py-2.5 rounded-md text-sm bg-surface border border-line text-ivory outline-none" })
                                                       ),
                                         error && h("p", { className: "text-xs text-crimson" }, error),
                                         h("button", {
                                                         onClick: handleSubmit,
                                                         disabled: submitting,
                                                         className: "font-sans w-full flex items-center justify-center gap-2 py-3 rounded-md bg-crimson text-ivory disabled:opacity-50",
                                         }, h(MessageCircle, { size: 14 }), submitting ? " ENVOI..." : " ENVOYER LA DEMANDE")
                                       )
                     )
             );
}
