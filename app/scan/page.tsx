"use client";

import { useState, createElement as h } from "react";
import { ScanLine, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { scanTicketAction } from "@/app/scan/actions";

export default function ScanPage() {
    const [code, setCode] = useState("");
    const [result, setResult] = useState<{ result: string; ticket?: any } | null>(null);
    const [loading, setLoading] = useState(false);

  async function handleScan() {
        if (!code.trim()) return;
        setLoading(true);
        const outcome = await scanTicketAction(code.trim());
        setLoading(false);
        setResult(outcome);
        setCode("");
  }

  return h("main", { className: "min-h-screen flex flex-col items-center px-5 py-16" },
               h("p", { className: "font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-crimson" }, "Menkeys Scan"),
               h("h1", { className: "font-display text-3xl sm:text-4xl mt-2" }, "Controle d'acces"),

               h("div", { className: "mt-10 flex gap-3 w-full max-w-md" },
                       h("input", {
                                 value: code,
                                 onChange: (e: any) => setCode(e.target.value),
                                 onKeyDown: (e: any) => e.key === "Enter" && handleScan(),
                                 placeholder: "Code du billet (ex: MK-123456)",
                                 className: "flex-1 px-4 py-3 rounded-md text-sm bg-surface border border-line text-ivory outline-none focus:border-crimson",
                       }),
                       h("button", {
                                 onClick: handleScan,
                                 disabled: loading,
                                 className: "font-sans px-5 py-3 rounded-md flex items-center gap-2 bg-crimson text-ivory disabled:opacity-50",
                       }, h(ScanLine, { size: 16 }), " SCANNER")
                     ),

               result && result.result === "granted" && h("div", { className: "mt-10 w-full max-w-md p-6 rounded-md border", style: { borderColor: "#22c55e", background: "rgba(34,197,94,0.08)" } },
                                                                h("div", { className: "flex justify-center mb-4" }, h(CheckCircle2, { size: 40, color: "#22c55e" })),
                                                                h("p", { className: "text-center font-display text-2xl", style: { color: "#22c55e" } }, "ACCES AUTORISE"),
                                                                result.ticket && h("p", { className: "text-center text-sm text-muted mt-2" }, result.ticket.holderName),
                                                                result.ticket && h("p", { className: "text-center font-display text-lg mt-1" }, result.ticket.code)
                                                              ),

               result && result.result === "already_used" && h("div", { className: "mt-10 w-full max-w-md p-6 rounded-md border", style: { borderColor: "#e31b23", background: "rgba(227,27,35,0.08)" } },
                                                                     h("div", { className: "flex justify-center mb-4" }, h(AlertTriangle, { size: 40, color: "#e31b23" })),
                                                                     h("p", { className: "text-center font-display text-2xl text-crimson" }, "BILLET DEJA UTILISE"),
                                                                     result.ticket && h("p", { className: "text-center text-sm text-muted mt-2" }, result.ticket.holderName),
                                                                     result.ticket && h("p", { className: "text-center font-display text-lg mt-1" }, result.ticket.code)
                                                                   ),

               result && result.result === "invalid" && h("div", { className: "mt-10 w-full max-w-md p-6 rounded-md border", style: { borderColor: "#e31b23", background: "rgba(227,27,35,0.08)" } },
                                                                h("div", { className: "flex justify-center mb-4" }, h(XCircle, { size: 40, color: "#e31b23" })),
                                                                h("p", { className: "text-center font-display text-2xl text-crimson" }, "BILLET INVALIDE")
                                                              )
             );
}
