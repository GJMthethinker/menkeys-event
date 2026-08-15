"use client";

import { useState, createElement as h } from "react";
import { useRouter } from "next/navigation";
import { createEventAction } from "@/app/organizer/actions";
import type { EventCategory } from "@/lib/types";

const DEMO_ORGANIZER_ID = "org_1";

const CATEGORIES: EventCategory[] = ["musique", "culture", "sport", "education", "business", "religion", "loisirs", "competitions"];

function slugify(s: string) {
    return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function NewEventPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [category, setCategory] = useState<EventCategory>("musique");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("20:00");
    const [venue, setVenue] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [capacity, setCapacity] = useState(100);
    const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
        if (!name || !date || !venue) return;
        setSubmitting(true);
        const event = await createEventAction({
                organizerId: DEMO_ORGANIZER_ID,
                slug: slugify(name),
                name,
                category,
                description,
                date,
                time,
                venue,
                address: address || venue,
                city,
                capacity,
        });
        setSubmitting(false);
        router.push("/organizer/events/" + event.id + "/tickets");
  }

  function field(label: string, inputEl: any) {
        return h("div", { className: "mb-4" },
                       h("label", { className: "text-[11px] uppercase tracking-wide text-muted" }, label),
                       h("div", { className: "mt-1" }, inputEl)
                     );
  }

  const inputClass = "w-full px-3 py-2.5 rounded-md text-sm bg-surface border border-line text-ivory outline-none focus:border-crimson";

  return h("main", { className: "min-h-screen px-5 sm:px-10 py-12 max-w-2xl" },
               h("p", { className: "font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-crimson" }, "Nouvel evenement"),
               h("h1", { className: "font-display text-3xl sm:text-4xl mt-1 mb-8" }, "Creer un evenement"),

               field("Nom de l'evenement", h("input", { value: name, onChange: (e: any) => setName(e.target.value), className: inputClass })),

               field("Categorie", h("select", { value: category, onChange: (e: any) => setCategory(e.target.value), className: inputClass },
                                          CATEGORIES.map((c) => h("option", { key: c, value: c }, c))
                                        )),

               field("Description", h("textarea", { value: description, onChange: (e: any) => setDescription(e.target.value), rows: 3, className: inputClass })),

               h("div", { className: "grid grid-cols-2 gap-4" },
                       field("Date", h("input", { type: "date", value: date, onChange: (e: any) => setDate(e.target.value), className: inputClass })),
                       field("Heure", h("input", { type: "time", value: time, onChange: (e: any) => setTime(e.target.value), className: inputClass }))
                     ),

               field("Lieu", h("input", { value: venue, onChange: (e: any) => setVenue(e.target.value), className: inputClass })),
               field("Adresse (optionnel)", h("input", { value: address, onChange: (e: any) => setAddress(e.target.value), className: inputClass })),

               h("div", { className: "grid grid-cols-2 gap-4" },
                       field("Ville", h("input", { value: city, onChange: (e: any) => setCity(e.target.value), className: inputClass })),
                       field("Capacite", h("input", { type: "number", value: capacity, onChange: (e: any) => setCapacity(Number(e.target.value)), className: inputClass }))
                     ),

               h("button", {
                       onClick: handleSubmit,
                       disabled: submitting,
                       className: "font-sans w-full py-3 rounded-md mt-4 bg-crimson text-ivory disabled:opacity-50",
               }, submitting ? "..." : "CREER L'EVENEMENT")
             );
}
