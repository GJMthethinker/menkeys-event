import sql from "@/lib/db";
import { generateId } from "@/lib/id";
import type { TicketType } from "@/lib/types";

function mapRow(r: any): TicketType {
    return {
          id: r.id,
          eventId: r.event_id,
          name: r.name,
          price: r.price,
          currency: r.currency,
          quantityTotal: r.quantity_total,
          quantitySold: r.quantity_sold,
          perks: r.perks ?? [],
          isFree: r.is_free,
    };
}

export async function listTicketTypesByEvent(eventId: string): Promise<TicketType[]> {
    const rows = await sql`select * from ticket_types where event_id = ${eventId} order by price asc`;
    return rows.map(mapRow);
}

export async function getTicketType(id: string): Promise<TicketType | undefined> {
    const rows = await sql`select * from ticket_types where id = ${id} limit 1`;
    return rows[0] ? mapRow(rows[0]) : undefined;
}

export async function createTicketType(
    input: Omit<TicketType, "id" | "quantitySold">
  ): Promise<TicketType> {
    const id = generateId("tt");
    const rows = await sql`
        insert into ticket_types (id, event_id, name, price, currency, quantity_total, quantity_sold, perks, is_free)
            values (${id}, ${input.eventId}, ${input.name}, ${input.price}, ${input.currency}, ${input.quantityTotal}, 0, ${input.perks}, ${input.isFree})
                returning *
                  `;
    return mapRow(rows[0]);
}

export function remaining(ticketType: TicketType): number {
    return ticketType.quantityTotal - ticketType.quantitySold;
}

export async function reserveInventory(ticketTypeId: string, quantity: number): Promise<boolean> {
    const rows = await sql`
        update ticket_types
            set quantity_sold = quantity_sold + ${quantity}
                where id = ${ticketTypeId} and quantity_sold + ${quantity} <= quantity_total
                    returning *
                      `;
    return rows.length > 0;
}
