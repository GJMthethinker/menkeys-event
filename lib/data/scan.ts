import sql from "@/lib/db";
import { generateId } from "@/lib/id";
import type { ScanResult, ScanLog, Ticket } from "@/lib/types";

export interface ScanOutcome {
    result: ScanResult;
    ticket?: Ticket;
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

export async function scanTicket(code: string, agentId?: string): Promise<ScanOutcome> {
    const rows = await sql`select * from tickets where code = ${code.trim()} limit 1`;
    const ticketRow = rows[0];

  let result: ScanResult;
    let ticket: Ticket | undefined;

  if (!ticketRow) {
        result = "invalid";
  } else if (ticketRow.status === "used") {
        result = "already_used";
        ticket = mapTicketRow(ticketRow);
  } else {
        result = "granted";
        const updated = await sql`
              update tickets set status = 'used', used_at = now(), scanned_by = ${agentId ?? null}
                    where id = ${ticketRow.id}
                          returning *
                              `;
        ticket = mapTicketRow(updated[0]);
  }

  const logId = generateId("scan");
    await sql`
        insert into scan_logs (id, ticket_code, event_id, result, agent_id)
            values (${logId}, ${code}, ${ticket?.eventId ?? ""}, ${result}, ${agentId ?? null})
              `;

  return { result, ticket };
}

export async function listScanLogsByEvent(eventId: string): Promise<ScanLog[]> {
    const rows = await sql`select * from scan_logs where event_id = ${eventId} order by scanned_at desc`;
    return rows.map((r: any) => ({
          id: r.id,
          ticketCode: r.ticket_code,
          eventId: r.event_id,
          result: r.result,
          scannedAt: r.scanned_at instanceof Date ? r.scanned_at.toISOString() : r.scanned_at,
          agentId: r.agent_id ?? undefined,
          offline: r.offline,
    }));
}
