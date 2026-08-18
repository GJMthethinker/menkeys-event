import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

    const session = await getSession();
    if (!session || (session.subjectType !== "organizer" && session.subjectType !== "admin")) {
                return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    
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
