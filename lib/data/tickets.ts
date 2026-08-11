import { ticketTypes } from "@/lib/data/store";
import { generateId } from "@/lib/id";
import type { TicketType } from "@/lib/types";

export async function listTicketTypesByEvent(
  eventId: string
): Promise<TicketType[]> {
  return ticketTypes.filter((t) => t.eventId === eventId);
}

export async function getTicketType(
  id: string
): Promise<TicketType | undefined> {
  return ticketTypes.find((t) => t.id === id);
}

export async function createTicketType(
  input: Omit<TicketType, "id" | "quantitySold">
): Promise<TicketType> {
  const record: TicketType = {
    ...input,
    id: generateId("tt"),
    quantitySold: 0,
  };
  ticketTypes.push(record);
  return record;
}

export function remaining(ticketType: TicketType): number {
  return ticketType.quantityTotal - ticketType.quantitySold;
}

// Réserve `quantity` billets sur un type de billet. Retourne false si le
// stock est insuffisant (contrôle fait ici pour éviter la survente —
// section 3.3 / 3.4 du cahier des charges).
export async function reserveInventory(
  ticketTypeId: string,
  quantity: number
): Promise<boolean> {
  const record = ticketTypes.find((t) => t.id === ticketTypeId);
  if (!record) return false;
  if (remaining(record) < quantity) return false;
  record.quantitySold += quantity;
  return true;
}
