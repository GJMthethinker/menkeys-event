import { createElement as h } from "react";
import { requireAdmin } from "@/lib/auth";
import TemplateEditorClient from "@/app/admin/templates/new/TemplateEditorClient";

export default async function NewTemplatePage() {
    await requireAdmin();

  return h("main", { className: "min-h-screen px-5 sm:px-10 py-12" },
               h("p", { className: "font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-crimson" }, "Menkeys Event"),
               h("h1", { className: "mt-1 font-display text-3xl sm:text-4xl" }, "Nouveau gabarit"),
               h("p", { className: "mt-2 max-w-lg text-sm text-muted" }, "Uploade le design vide prepare par le designer, puis place la zone du QR code directement dessus."),
               h(TemplateEditorClient, {})
             );
}
