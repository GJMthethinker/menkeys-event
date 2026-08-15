import Link from "next/link";
import { createElement as h } from "react";
import { Plus, Crown } from "lucide-react";
import { getOrganizerById } from "@/lib/data/organizers";
import { listEventsByOrganizer } from "@/lib/data/events";

const DEMO_ORGANIZER_ID = "org_1";

export default async function OrganizerPage() {
    const organizer = await getOrganizerById(DEMO_ORGANIZER_ID);
    const events = await listEventsByOrganizer(DEMO_ORGANIZER_ID);

  return h("main", { className: "min-h-screen px-5 sm:px-10 py-12" },
               h("div", { className: "flex items-center justify-between flex-wrap gap-4" },
                       h("div", {},
                                 h("p", { className: "font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-crimson" }, "Espace Organisateur"),
                                 h("h1", { className: "font-display text-3xl sm:text-4xl mt-1" }, organizer ? organizer.name : "Organisateur"),
                                 organizer && organizer.verified && h("p", { className: "flex items-center gap-1 text-xs mt-1", style: { color: "#c9a227" } }, h(Crown, { size: 12 }), " Organisateur verifie")
                               ),
                       h(Link, { href: "/organizer/events/new", className: "font-sans flex items-center gap-2 px-5 py-3 rounded-md bg-crimson text-ivory" }, h(Plus, { size: 14 }), " CREER UN EVENEMENT")
                     ),

               h("div", { className: "mt-10" },
                       h("p", { className: "font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-muted mb-4" }, "Mes evenements (" + events.length + ")"),
                       events.length === 0
                         ? h("div", { className: "border border-dashed border-line p-10 text-center text-sm text-muted" }, "Aucun evenement pour le moment.")
                         : h("div", { className: "space-y-3" },
                                         events.map((ev) => h(Link, {
                                                         key: ev.id,
                                                         href: "/organizer/events/" + ev.id + "/tickets",
                                                         className: "clip-corner-tr flex items-center justify-between border border-line bg-surface p-5 hover:border-crimson",
                                         },
                                                                            h("div", {},
                                                                                              h("div", { className: "flex items-center gap-3" },
                                                                                                                  h("span", { className: "font-display text-xl" }, ev.name),
                                                                                                                  h("span", {
                                                                                                                                        className: "font-sans text-[10px] uppercase px-2 py-1 rounded-full",
                                                                                                                                        style: ev.status === "published" ? { background: "rgba(34,197,94,0.15)", color: "#22c55e" } : { background: "rgba(148,143,134,0.15)", color: "#948f86" },
                                                                                                                    }, ev.status === "published" ? "Publie" : "Brouillon")
                                                                                                                ),
                                                                                              h("div", { className: "flex items-center gap-4 mt-2 text-xs text-muted" },
                                                                                                                  h("span", {}, ev.date),
                                                                                                                  h("span", {}, ev.city)
                                                                                                                )
                                                                                            )
                                                                          ))
                                       )
                     )
             );
}
