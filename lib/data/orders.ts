import sql from "@/lib/db";
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

function mapOrderRow(r: any): Order {
    return {
          id: r.id,
          eventId: r.event_id,
          ticketTypeId: r.ticket_type_id,
          quantity: r.quantity,
          totalAmount: r.total_amount,
          currency: r.currency,
          paymentMethod: r.payment_method,
          paymentStatus: r.payment_status,
          participant: {
                  firstName: r.first_name,
                  lastName: r.last_name,
                  phone: r.phone,
                  email: r.email ?? undefined,
          },
          createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : r.created_at,
    };
}

function mapTicketRow(r: any): Ticket {
    return {
          id: r.id,
          code: r.code,
          orderId: r.order_id,
          eventId: r.event_id,
          ticketTypeId: r.ticket_type_id,
          holderName: r.holder_name,
          status: r.status,
          qrPayload: r.qr_payload,
          issuedAt: r.issued_at instanceof Date ? r.issued_at.toISOString() : r.issued_at,
          usedAt: r.used_at ? (r.used_at instanceof Date ? r.used_at.toISOString() : r.used_at) : undefined,
          scannedBy: r.scanned_by ?? undefined,
    };
}

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
    const ticketType = await getTicketType(input.ticketTypeId);
    if (!ticketType) return { ok: false, reason: "sold_out" };

  const reserved = await reserveInventory(input.ticketTypeId, input.quantity);
    if (!reserved) return { ok: false, reason: "sold_out" };

  const orderId = generateId("ord");
    const totalAmount = ticketType.price * input.quantity;

  const orderRows = await sql`
      insert into orders (id, event_id, ticket_type_id, quantity, total_amount, currency, payment_method, payment_status, first_name, last_name, phone, email)
          values (${orderId}, ${input.eventId}, ${input.ticketTypeId}, ${input.quantity}, ${totalAmount}, ${ticketType.currency}, ${input.paymentMethod}, 'paid', ${input.participant.firstName}, ${input.participant.lastName}, ${input.participant.phone}, ${input.participant.email ?? null})
              returning *
                `;
    const order = mapOrderRow(orderRows[0]);

  const ticketsIssued: Ticket[] = [];
    for (let i = 0; i < input.quantity; i++) {
          const code = generateTicketCode();
          const ticketId = generateId("tkt");
          const holderName = `${input.participant.firstName} ${input.participant.lastName}`;
          const qrPayload = generateQrPayload(code, input.eventId);
          const rows = await sql`
                insert into tickets (id, code, order_id, event_id, ticket_type_id, holder_name, status, qr_payload)
                      values (${ticketId}, ${code}, ${orderId}, ${input.eventId}, ${input.ticketTypeId}, ${holderName}, 'valid', ${qrPayload})
                            returning *
                                `;
          ticketsIssued.push(mapTicketRow(rows[0]));
    }

  return { ok: true, order, ticketsIssued };
}

export async function listOrdersByEvent(eventId: string): Promise<Order[]> {
    const rows = await sql`select * from orders where event_id = ${eventId}`;
    return rows.map(mapOrderRow);
}

export async function listTicketsByEvent(eventId: string): Promise<Ticket[]> {
    const rows = await sql`select * from tickets where event_id = ${eventId}`;
    return rows.map(mapTicketRow);
}

export async function getOrderById(id: string): Promise<Order | undefined> {
    const rows = await sql`select * from orders where id = ${id} limit 1`;
    return rows[0] ? mapOrderRow(rows[0]) : undefined;
}

export async function listTicketsByOrder(orderId: string): Promise<Ticket[]> {
    const rows = await sql`select * from tickets where order_id = ${orderId}`;
    return rows.map(mapTicketRow);
}
