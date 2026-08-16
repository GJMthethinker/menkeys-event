import { createElement as h } from "react";
import AdminLoginClient from "@/app/admin/login/AdminLoginClient";

export default function AdminLoginPage() {
    return h("main", { className: "min-h-screen flex items-center justify-center px-5 py-16" },
                 h("div", { className: "w-full max-w-sm" },
                         h("p", { className: "font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-crimson" }, "Menkeys Event"),
                         h("h1", { className: "mt-1 font-display text-3xl" }, "Super Admin"),
                         h(AdminLoginClient, {})
                       )
               );
}
