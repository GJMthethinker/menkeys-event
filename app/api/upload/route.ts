import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireOrganizer } from "@/lib/auth";

export async function POST(request: Request) {
    await requireOrganizer();

  const form = await request.formData();
    const file = form.get("file") as File | null;
    if (!file) {
          return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

  const blob = await put(`events/${Date.now()}-${file.name}`, file, {
        access: "public",
  });

  return NextResponse.json({ url: blob.url });
}
