"use server";

import { requireAdmin } from "@/lib/auth";
import { createTemplate } from "@/lib/data/templates";

export async function createTemplateAction(input: {
    name: string;
    type: "ticket" | "bracelet";
    imageUrl: string;
    imageWidth: number;
    imageHeight: number;
    qrX: number;
    qrY: number;
    qrSize: number;
}) {
    await requireAdmin();
    return createTemplate(input);
}
