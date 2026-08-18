import sql from "@/lib/db";
import { generateId } from "@/lib/id";

export type TicketTemplate = {
    id: string;
    name: string;
    type: "ticket" | "bracelet";
    imageUrl: string;
    imageWidth: number;
    imageHeight: number;
    qrX: number;
    qrY: number;
    qrSize: number;
    createdAt: string;
};

function mapRow(r: any): TicketTemplate {
    return {
          id: r.id,
          name: r.name,
          type: r.type,
          imageUrl: r.image_url,
          imageWidth: r.image_width,
          imageHeight: r.image_height,
          qrX: r.qr_x,
          qrY: r.qr_y,
          qrSize: r.qr_size,
          createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : r.created_at,
    };
}

export async function createTemplate(input: {
    name: string;
    type: "ticket" | "bracelet";
    imageUrl: string;
    imageWidth: number;
    imageHeight: number;
    qrX: number;
    qrY: number;
    qrSize: number;
}): Promise<TicketTemplate> {
    const id = generateId("tpl");
    const rows = await sql`
        insert into ticket_templates (id, name, type, image_url, image_width, image_height, qr_x, qr_y, qr_size)
            values (${id}, ${input.name}, ${input.type}, ${input.imageUrl}, ${input.imageWidth}, ${input.imageHeight}, ${input.qrX}, ${input.qrY}, ${input.qrSize})
                returning *
                  `;
    return mapRow(rows[0]);
}

export async function listTemplates(): Promise<TicketTemplate[]> {
    const rows = await sql`select * from ticket_templates order by created_at desc`;
    return rows.map(mapRow);
}

export async function getTemplateById(id: string): Promise<TicketTemplate | undefined> {
    const rows = await sql`select * from ticket_templates where id = ${id} limit 1`;
    return rows[0] ? mapRow(rows[0]) : undefined;
}
