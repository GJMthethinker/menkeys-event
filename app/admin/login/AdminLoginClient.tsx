"use client";

import { useState, createElement as h } from "react";
import { useRouter } from "next/navigation";
import { loginAdminAction } from "@/app/organizer/actions";

export default function AdminLoginClient() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
        setError(null);
        if (!email || !password) {
                setError("Merci de remplir email et mot de passe.");
                return;
        }
        setSubmitting(true);
        const result = await loginAdminAction(email, password);
        setSubmitting(false);
        if (!result.ok) {
                setError("Email ou mot de passe incorrect.");
                return;
        }
        router.push("/admin");
        router.refresh();
  }

  return h("div", { className: "mt-8 space-y-4" },
               h("div", {},
                       h("label", { className: "text-[11px] uppercase text-muted" }, "Email"),
                       h("input", { type: "email", value: email, onChange: (e: any) => setEmail(e.target.value), className: "w-full mt-1 px-3 py-2.5 rounded-md text-sm bg-surface border border-line text-ivory outline-none" })
                     ),
               h("div", {},
                       h("label", { className: "text-[11px] uppercase text-muted" }, "Mot de passe"),
                       h("input", { type: "password", value: password, onChange: (e: any) => setPassword(e.target.value), className: "w-full mt-1 px-3 py-2.5 rounded-md text-sm bg-surface border border-line text-ivory outline-none" })
                     ),
               error && h("p", { className: "text-xs text-crimson" }, error),
               h("button", {
                       onClick: handleSubmit,
                       disabled: submitting,
                       className: "font-sans w-full py-3 rounded-md bg-crimson text-ivory disabled:opacity-50",
               }, submitting ? "..." : "SE CONNECTER")
             );
}
