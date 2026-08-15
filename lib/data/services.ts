import sql from "@/lib/db";
import { generateId } from "@/lib/id";
import type { ServiceRequest, ServiceType } from "@/lib/types";

function mapRow(r: any): ServiceRequest {
    return {
          id: r.id,
          eventId: r.event_id,
          organizerId: r.organizer_id,
          type: r.type,
          quantity: r.quantity,
          contactName: r.contact_name,
          contactPhone: r.contact_phone,
          notes: r.notes ?? undefined,
          status: r.status,
          createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : r.created_at,
    };
}

export async function createServiceRequest(input: {
    eventId: string;
    organizerId: string;
    type: ServiceType;
    quantity: number;
    contactName: string;
    contactPhone: string;
    notes?: string;
}): Promise<ServiceRequest> {
    const id = generateId("svc");
    const rows = await sql`
        insert into service_requests (id, event_id, organizer_id, type, quantity, contact_name, contact_phone, notes, status)
            values (${id}, ${input.eventId}, ${input.organizerId}, ${input.type}, ${input.quantity}, ${input.contactName}, ${input.contactPhone}, ${input.notes ?? null}, 'pending')
                returning *
                  `;
    return mapRow(rows[0]);
}

export async function listServiceRequestsByEvent(eventId: string): Promise<ServiceRequest[]> {
    const rows = await sql`select * from service_requests where event_id = ${eventId} order by created_at desc`;
    return rows.map(mapRow);
}
