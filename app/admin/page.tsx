import { createElement as h } from "react";
import { requireAdmin } from "@/lib/auth";
import { listAllOrganizers } from "@/lib/data/organizers";
import { listAllEvents } from "@/lib/data/events";
import { listAllServiceRequests } from "@/lib/data/services";
import { logoutAdminAction } from "@/app/organizer/actions";

function StatCard(props: { label: string; value: string }) {
    return h("div", { className: "border border-line bg-surface p-5" },
                 h("div", { className: "font-sans text-[11px] uppercase tracking-[0.15em] text-muted" }, props.label),
                 h("div", { className: "font-display text-3xl mt-1" }, props.value)
               );
}

export default async function AdminDashboardPage() {
    await requireAdmin();

  const organizers = await listAllOrganizers();
    const events = await listAllEvents();
    const serviceRequests = await listAllServiceRequests();

  const organizerNameById = new Map(organizers.map((o) => [o.id, o.name]));
    const publishedCount = events.filter((e) => e.status === "published").length;
    const pendingCount = serviceRequests.filter((r) => r.status === "pending").length;

  return h("main", { className: "min-h-screen px-5 sm:px-10 py-12" },
               h("div", { className: "flex items-center justify-between flex-wrap gap-4" },
                       h("div", {},
                                 h("p", { className: "font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-crimson" }, "Menkeys Event"),
                                 h("h1", { className: "mt-1 font-display text-3xl sm:text-4xl" }, "Super Admin")
                               ),
                       h("form", { action: logoutAdminAction },
                                 h("button", { type: "submit", className: "font-sans px-4 py-2.5 rounded-md border border-line hover:border-crimson text-[11px] uppercase tracking-[0.15em]" }, "Deconnexion")
                               )
                     ),

               h("div", { className: "grid gap-4 sm:grid-cols-4 mt-8" },
                       h(StatCard, { label: "Organisateurs", value: String(organizers.length) }),
                       h(StatCard, { label: "Evenements", value: String(events.length) }),
                       h(StatCard, { label: "Evenements publies", value: String(publishedCount) }),
                       h(StatCard, { label: "Demandes en attente", value: String(pendingCount) })
                     ),

               h("div", { className: "mt-10" },
                       h("p", { className: "font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-muted mb-4" }, "Demandes de service (" + serviceRequests.length + ")"),
                       serviceRequests.length === 0
                         ? h("div", { className: "border border-dashed border-line p-6 text-center text-sm text-muted" }, "Aucune demande pour le moment.")
                         : h("div", { className: "border border-line divide-y divide-line" },
                                         serviceRequests.map((r) => h("div", { key: r.id, className: "p-4 flex items-center justify-between flex-wrap gap-2 bg-surface" },
                                                                                    h("div", {},
                                                                                                      h("div", { className: "font-display text-lg" }, r.type + " x" + r.quantity),
                                                                                                      h("div", { className: "text-xs text-muted mt-1" }, r.eventName + " - " + r.organizerName),
                                                                                                      h("div", { className: "text-xs text-muted mt-1" }, r.contactName + " - " + r.contactPhone)
                                                                                                    ),
                                                                                    h("span", {
                                                                                                      className: "font-sans text-[10px] uppercase px-2 py-1 rounded-full",
                                                                                                      style: r.status === "pending" ? { background: "rgba(227,27,35,0.15)", color: "#e31b23" } : { background: "rgba(34,197,94,0.15)", color: "#22c55e" },
                                                                                    }, r.status)
                                                                                  ))
                                       )
                     ),

               h("div", { className: "mt-10" },
                       h("p", { className: "font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-muted mb-4" }, "Evenements (" + events.length + ")"),
                       h("div", { className: "border border-line divide-y divide-line" },
                                 events.map((ev) => h("div", { key: ev.id, className: "p-4 flex items-center justify-between flex-wrap gap-2 bg-surface" },
                                                                h("div", {},
                                                                              h("div", { className: "font-display text-lg" }, ev.name),
                                                                              h("div", { className: "text-xs text-muted mt-1" }, (organizerNameById.get(ev.organizerId) ?? "?") + " - " + ev.date + " - " + ev.city)
                                                                            ),
                                                                h("span", {
                                                                              className: "font-sans text-[10px] uppercase px-2 py-1 rounded-full",
                                                                              style: ev.status === "published" ? { background: "rgba(34,197,94,0.15)", color: "#22c55e" } : { background: "rgba(148,143,134,0.15)", color: "#948f86" },
                                                                }, ev.status)
                                                              ))
                               )
                     ),

               h("div", { className: "mt-10" },
                       h("p", { className: "font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-muted mb-4" }, "Organisateurs (" + organizers.length + ")"),
                       h("div", { className: "border border-line divide-y divide-line" },
                                 organizers.map((o) => h("div", { key: o.id, className: "p-4 flex items-center justify-between flex-wrap gap-2 bg-surface" },
                                                                   h("div", {},
                                                                                 h("div", { className: "font-display text-lg" }, o.name),
                                                                                 h("div", { className: "text-xs text-muted mt-1" }, o.email + (o.phone ? " - " + o.phone : ""))
                                                                               ),
                                                                   o.verified && h("span", { className: "text-[10px] uppercase px-2 py-1 rounded-full", style: { background: "rgba(201,162,39,0.15)", color: "#c9a227" } }, "Verifie")
                                                                 ))
                               )
                     )
             );
}
