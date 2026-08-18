import { createElement as h } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { listTemplates } from "@/lib/data/templates";

export default async function TemplatesPage() {
    await requireAdmin();
    const templates = await listTemplates();

  return h("main", { className: "min-h-screen px-5 sm:px-10 py-12" },
               h("div", { className: "flex items-center justify-between flex-wrap gap-4" },
                       h("div", {},
                                 h("p", { className: "font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-crimson" }, "Menkeys Event"),
                                 h("h1", { className: "mt-1 font-display text-3xl sm:text-4xl" }, "Gabarits de billets")
                               ),
                       h(Link, { href: "/admin/templates/new", className: "font-sans px-5 py-3 rounded-md bg-crimson text-ivory text-[11px] uppercase tracking-[0.15em]" }, "+ Nouveau gabarit")
                     ),


               h("div", { className: "mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" },
                       templates.length === 0
                         ? h("p", { className: "text-sm text-muted" }, "Aucun gabarit pour le moment.")
                         : templates.map((t) => h("div", { key: t.id, className: "border border-line bg-surface rounded-md overflow-hidden" },
                                                              h("img", { src: t.imageUrl, className: "w-full h-40 object-cover" }),
                                                              h("div", { className: "p-4" },
                                                                              h("div", { className: "font-display text-lg" }, t.name),
                                                                              h("div", { className: "text-xs text-muted mt-1 capitalize" }, t.type)
                                                                            )
                                                            ))
                     )
             );
}
