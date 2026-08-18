"use client";

import { useState, useRef, createElement as h } from "react";
import { useRouter } from "next/navigation";
import { createTemplateAction } from "@/app/admin/actions";

type Box = { x: number; y: number; size: number };

export default function TemplateEditorClient() {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const dragState = useRef<{ mode: "move" | "resize"; startX: number; startY: number; startBox: Box } | null>(null);

  const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [naturalWidth, setNaturalWidth] = useState(0);
    const [naturalHeight, setNaturalHeight] = useState(0);
    const [box, setBox] = useState<Box>({ x: 0.35, y: 0.35, size: 0.3 });
    const [name, setName] = useState("");
    const [type, setType] = useState<"ticket" | "bracelet">("ticket");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

  function handleFile(f: File) {
        setFile(f);
        setPreviewUrl(URL.createObjectURL(f));
  }

  function handleImageLoad(e: any) {
        setNaturalWidth(e.target.naturalWidth);
        setNaturalHeight(e.target.naturalHeight);
  }

  function onBoxMouseDown(e: any, mode: "move" | "resize") {
        e.preventDefault();
        e.stopPropagation();
        dragState.current = { mode, startX: e.clientX, startY: e.clientY, startBox: { ...box } };
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
  }

  function onMouseMove(e: any) {
        if (!dragState.current || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const dx = (e.clientX - dragState.current.startX) / rect.width;
        const dy = (e.clientY - dragState.current.startY) / rect.height;
        const sb = dragState.current.startBox;
        if (dragState.current.mode === "move") {
                let nx = Math.max(0, Math.min(1 - sb.size, sb.x + dx));
                let ny = Math.max(0, Math.min(1 - sb.size, sb.y + dy));
                setBox({ ...sb, x: nx, y: ny });
        } else {
                let nsize = Math.max(0.05, Math.min(1 - sb.x, sb.size + dx));
                setBox({ ...sb, size: nsize });
        }
  }

  function onMouseUp() {
        dragState.current = null;
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
  }

  async function handleSave() {
        setError(null);
        if (!file || !name) {
                setError("Merci de choisir une image et de donner un nom au gabarit.");
                return;
        }
        setSaving(true);
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        const uploadData = await uploadRes.json();
        if (!uploadData.url) {
                setSaving(false);
                setError("Echec de l'upload de l'image.");
                return;
        }
        await createTemplateAction({
                name,
                type,
                imageUrl: uploadData.url,
                imageWidth: naturalWidth,
                imageHeight: naturalHeight,
                qrX: box.x,
                qrY: box.y,
                qrSize: box.size,
        });
        setSaving(false);
        router.push("/admin/templates");
        router.refresh();
  }

  const heightFraction = naturalWidth && naturalHeight ? box.size * (naturalWidth / naturalHeight) : box.size;

  return h("div", { className: "mt-8 max-w-2xl space-y-6" },
               h("div", {},
                       h("label", { className: "text-[11px] uppercase text-muted" }, "Nom du gabarit"),
                       h("input", { value: name, onChange: (e: any) => setName(e.target.value), placeholder: "Ex: Billet standard 2026", className: "w-full mt-1 px-3 py-2.5 rounded-md text-sm bg-surface border border-line text-ivory outline-none" })
                     ),
               h("div", {},
                       h("label", { className: "text-[11px] uppercase text-muted mb-2 block" }, "Type"),
                       h("div", { className: "flex gap-3" },
                                 h("button", { onClick: () => setType("ticket"), className: "px-4 py-2 rounded-md text-sm border", style: { borderColor: type === "ticket" ? "#e31b23" : "#2c2a27", background: type === "ticket" ? "rgba(227,27,35,0.1)" : "transparent" } }, "Billet"),
                                 h("button", { onClick: () => setType("bracelet"), className: "px-4 py-2 rounded-md text-sm border", style: { borderColor: type === "bracelet" ? "#e31b23" : "#2c2a27", background: type === "bracelet" ? "rgba(227,27,35,0.1)" : "transparent" } }, "Bracelet")
                               )
                     ),
               h("div", {},
                       h("label", { className: "text-[11px] uppercase text-muted" }, "Image du gabarit (design vide)"),
                       h("input", { type: "file", accept: "image/*", onChange: (e: any) => { const f = e.target.files?.[0]; if (f) handleFile(f); }, className: "w-full mt-1 text-xs text-muted" })
                     ),

               previewUrl && h("div", {},
                                     h("p", { className: "text-[11px] uppercase text-muted mb-2" }, "Clique-glisse la zone rouge pour placer le QR, tire le coin pour redimensionner"),
                                     h("div", {
                                               ref: containerRef,
                                               className: "relative border border-line inline-block select-none",
                                               style: { maxWidth: "480px", width: "100%" },
                                     },
                                               h("img", { src: previewUrl, onLoad: handleImageLoad, draggable: false, className: "w-full block" }),
                                               h("div", {
                                                           onMouseDown: (e: any) => onBoxMouseDown(e, "move"),
                                                           className: "absolute border-2 border-crimson bg-crimson/20 cursor-move",
                                                           style: { left: (box.x * 100) + "%", top: (box.y * 100) + "%", width: (box.size * 100) + "%", height: (heightFraction * 100) + "%" },
                                               },
                                                           h("div", {
                                                                         onMouseDown: (e: any) => onBoxMouseDown(e, "resize"),
                                                                         className: "absolute right-0 bottom-0 w-4 h-4 bg-crimson cursor-nwse-resize",
                                                                         style: { transform: "translate(50%, 50%)" },
                                                           })
                                                         )
                                             )
                                   ),

               error && h("p", { className: "text-xs text-crimson" }, error),
               h("button", {
                       onClick: handleSave,
                       disabled: saving,
                       className: "font-sans px-6 py-3 rounded-md bg-crimson text-ivory disabled:opacity-50",
               }, saving ? "..." : "ENREGISTRER LE GABARIT")
             );
}
