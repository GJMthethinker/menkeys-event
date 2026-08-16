import Link from "next/link";
import { createElement as h } from "react";
import { getSession } from "@/lib/auth";
import { logoutOrganizerAction, logoutAdminAction } from "@/app/organizer/actions";

export default async function NavBar() {
    const session = await getSession();

  const linkClass = "font-sans text-[11px] uppercase tracking-[0.1em] text-muted hover:text-ivory";
    const btnClass = "font-sans text-[11px] uppercase tracking-[0.1em] text-muted hover:text-crimson";

  return h("nav", { className: "sticky top-0 z-50 flex items-center justify-between px-5 sm:px-10 py-4 border-b border-line bg-black/90 backdrop-blur" },
               h(Link, { href: "/", className: "font-display text-lg" }, "MENKEYS EVENT"),
               h("div", { className: "flex items-center gap-6" },
                       h(Link, { href: "/discover", className: linkClass }, "Decouvrir"),
                       !session && h(Link, { href: "/organizer/login", className: linkClass }, "Espace organisateur"),
                       session && session.subjectType === "organizer" && h(Link, { href: "/organizer", className: linkClass }, "Mon espace"),
                       session && session.subjectType === "admin" && h(Link, { href: "/admin", className: linkClass }, "Super Admin"),
                       session && session.subjectType === "organizer" && h("form", { action: logoutOrganizerAction }, h("button", { type: "submit", className: btnClass }, "Deconnexion")),
                       session && session.subjectType === "admin" && h("form", { action: logoutAdminAction }, h("button", { type: "submit", className: btnClass }, "Deconnexion"))
                     )
             );
}
