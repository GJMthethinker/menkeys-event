"use client";

import { useMemo, useState, createElement as h } from "react";
import Link from "next/link";
import { Search, MapPin, Calendar } from "lucide-react";
import type { EventRecord, EventCategory } from "@/lib/types";

const CATEGORIES: { value: EventCategory | "all"; label: string; emoji: string }[] = [
  { value: "all", label: "Tous", emoji: "" },
  { value: "musique", label: "Musique", emoji: "\ud83c\udfb5" },
  { value: "culture", label: "Culture", emoji: "\ud83c\udfad" },
  { value: "sport", label: "Sport", emoji: "\u26bd" },
  { value: "education", label: "Education", emoji: "\ud83c\udf93" },
  { value: "business", label: "Business", emoji: "\ud83d\udcbc" },
  { value: "religion", label: "Religion", emoji: "\ud83d\ude4f" },
  { value: "loisirs", label: "Loisirs", emoji: "\ud83c\udf89" },
  { value: "competitions", label: "Competitions", emoji: "\ud83c\udfc6" },
  ];

const MOIS = ["janvier","fevrier","mars","avril","mai","juin","juillet","aout","septembre","octobre","novembre","decembre"];

function formatDate(iso: string) {
    const parts = iso.split("-").map(Number);
    return parts[2] + " " + MOIS[parts[1] - 1] + " " + parts[0];
}

function formatHTG(n: number) {
    return n.toLocaleString("fr-FR") + " HTG";
}

interface Item {
    event: EventRecord;
    minPrice: number;
}

export default function DiscoverClient({ items }: { items: Item[] }) {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState<EventCategory | "all">("all");

  const filtered = useMemo(() => {
        return items.filter(({ event }) => {
                const matchesCategory = category === "all" || event.category === category;
                const q = query.trim().toLowerCase();
                const matchesQuery =
                          q === "" ||
                          event.name.toLowerCase().includes(q) ||
                          event.city.toLowerCase().includes(q) ||
                          event.venue.toLowerCase().includes(q);
                return matchesCategory && matchesQuery;
        });
  }, [items, query, category]);

  return h("main", { className: "min-h-screen px-5 py-12 sm:px-10" },
               h("p", { className: "font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-crimson" }, "Menkeys Discover"),
               h("h1", { className: "mt-2 font-display text-3xl uppercase sm:text-5xl" }, "Trouve ton prochain evenement"),
               h("div", { className: "mt-8 relative max-w-lg" },
                       h(Search, { size: 16, className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted" }),
                       h("input", {
                                 value: query,
                                 onChange: (ev: any) => setQuery(ev.target.value),
                                 placeholder: "Rechercher un evenement, une ville...",
                                 className: "w-full pl-10 pr-4 py-3 rounded-md text-sm bg-surface border border-line text-ivory outline-none focus:border-crimson",
                       })
                     ),
               h("div", { className: "mt-6 flex flex-wrap gap-2" },
                       CATEGORIES.map((c) => h("button", {
                                 key: c.value,
                                 onClick: () => setCategory(c.value),
                                 className: "font-sans px-3 py-2 rounded-full text-[11px] uppercase tracking-wide border",
                                 style: {
                                             borderColor: category === c.value ? "#e31b23" : "#2c2a27",
                                             background: category === c.value ? "#e31b23" : "transparent",
                                             color: category === c.value ? "#f4f1ea" : "#948f86",
                                 },
                       }, c.emoji + " " + c.label))
                     ),
               h("div", { className: "mt-10" },
                       h("p", { className: "font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-muted mb-4" }, filtered.length + " evenement(s) trouve(s)"),
                       filtered.length === 0
                         ? h("div", { className: "border border-dashed border-line p-10 text-center text-sm text-muted" }, "Aucun evenement ne correspond a ta recherche.")
                         : h("div", { className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3" },
                                         filtered.map(({ event, minPrice }) => h(Link, {
                                                         key: event.id,
                                                         href: "/events/" + event.slug,
                                                         className: "clip-corner-tr block border border-line bg-surface p-5 hover:border-crimson",
                                         },
                                                                                               h("p", { className: "font-sans text-[11px] uppercase tracking-[0.15em] text-crimson" },
                                                                                                                 (CATEGORIES.find((c) => c.value === event.category)?.emoji ?? "") + " " + (CATEGORIES.find((c) => c.value === event.category)?.label ?? "")
                                                                                                               ),
                                                                                               h("h2", { className: "mt-2 font-display text-2xl" }, event.name),
                                                                                               h("div", { className: "mt-3 space-y-1 text-xs text-muted" },
                                                                                                                 h("div", { className: "flex items-center gap-1.5" }, h(Calendar, { size: 12 }), " " + formatDate(event.date)),
                                                                                                                 h("div", { className: "flex items-center gap-1.5" }, h(MapPin, { size: 12 }), " " + event.venue + ", " + event.city)
                                                                                                               ),
                                                                                               h("div", { className: "mt-4 font-display text-lg" }, minPrice === 0 ? "Gratuit" : "A partir de " + formatHTG(minPrice))
                                                                                             ))
                                       )
                     )
             );
}
