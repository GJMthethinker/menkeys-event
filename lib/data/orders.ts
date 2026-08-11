import { orders, tickets } from "@/lib/data/store";
import { getTicketType, reserveInventory } from "@/lib/data/tickets";
import { generateId, generateTicketCode, generateQrPayload } from "@/lib/id";
import type { Order, PaymentMethod, Ticket } from "@/lib/types";

interface CreateOrderInput {
  eventId: string;
  ticketTypeId: string;
  quantity: number;
  paymentMethod: PaymentMethod;
  participant: Order["participant"];
}

interface CreateOrderResult {
  ok: boolean;
  reason?: "sold_out";
  order?: Order;
  ticketsIssued?: Ticket[];
}

// Simule le flux décrit aux sections 11-12 : sélection -> infos -> paiement
// -> confirmation -> génération automatique du billet. Le vrai appel au
// prestataire de paiement (MonCash, carte) viendra remplacer le
// paymentStatus "paid" immédiat ci-dessous par un statut "pending" en
// attendant le webhook du prestataire.
export async function createOrder(
  input: CreateOrderInput
): Promise<CreateOrderResult> {
  const ticketType = await getTicketType(input.ticketTypeId);
  if (!ticketType) return { ok: false, reason: "sold_out" };

  const reserved = await reserveInventory(input.ticketTypeId, input.quantity);
  if (!reserved) return { ok: false, reason: "sold_out" };

  const order: Order = {
    id: generateId("ord"),
    eventId: input.eventId,
    ticketTypeId: input.ticketTypeId,
    quantity: input.quantity,
    totalAmount: ticketType.price * input.quantity,
    currency: ticketType.currency,
    paymentMethod: input.paymentMethod,
    paymentStatus: ticketType.isFree ? "paid" : "paid", // simulateur : paiement toujours accepté en dev
    participant: input.participant,
    createdAt: new Date().toISOString(),
  };
  orders.push(order);

  const ticketsIssued: Ticket[] = [];
  for (let i = 0; i < input.quantity; i++) {
    const code = generateTicketCode();
    const ticket: Ticket = {
      id: generateId("tkt"),
      code,
      orderId: order.id,
      eventId: input.eventId,
      ticketTypeId: input.ticketTypeId,
      holderName: `${input.participant.firstName} ${input.participant.lastName}`,
      status: "valid",
      qrPayload: generateQrPayload(code, input.eventId),
      issuedAt: new Date().toISOString(),
    };
    tickets.push(ticket);
    ticketsIssued.push(ticket);
  }

  return { ok: true, order, ticketsIssued };
}

export async function listOrdersByEvent(eventId: string): Promise<Order[]> {
  return orders.filter((o) => o.eventId === eventId);
}

export async function listTicketsByEvent(eventId: string): Promise<Ticket[]> {
  return tickets.filter((t) => t.eventId === eventId);
}
