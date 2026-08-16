import { createElement as h } from "react";
import Link from "next/link";
import SignupClient from "@/app/organizer/signup/SignupClient";

export default function OrganizerSignupPage() {
    return h("main", { className: "min-h-screen flex items-center justify-center px-5 py-16" },
                 h("div", { className: "w-full max-w-sm" },
                         h("p", { className: "font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-crimson" }, "Espace organisateur"),
                         h("h1", { className: "mt-1 font-display text-3xl" }, "Creer un compte"),
                         h(SignupClient, {}),
                         h("p", { className: "mt-6 text-sm text-muted" },
                                   "Deja un compte ? ",
                                   h(Link, { href: "/organizer/login", className: "text-crimson" }, "Se connecter")
                                 )
                       )
               );
}
