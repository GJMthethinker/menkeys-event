import sql from "@/lib/db";
import { generateId } from "@/lib/id";
import type { EventRecord, EventStatus } from "@/lib/types";

function mapRow(r: any): EventRecord {
    return {
          id: r.id,
          organizerId: r.organizer_id,
          slug: r.slug,
          name: r.name,
          category: r.category,
          description: r.description,
          date: r.date,
          time: r.time,
          venue: r.venue,
          address: r.address,
          city: r.city,
          coverImageUrl: r.cover_image_url ?? undefined,
          capacity: r.capacity,
          status: r.status,
          createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : r.created_at,
    };
}

export async function listPublishedEvents(): Promise<EventRecord[]> {
    const rows = await sql`select * from events where status = 'published' order by date asc`;
    return rows.map(mapRow);
}

export async function listEventsByOrganizer(organizerId: string): Promise<EventRecord[]> {
    const rows = await sql`select * from events where organizer_id = ${organizerId} order by created_at desc`;
    return rows.map(mapRow);
}

export async function getEventBySlug(slug: string): Promise<EventRecord | undefined> {
    const rows = await sql`select * from events where slug = ${slug} limit 1`;
    return rows[0] ? mapRow(rows[0]) : undefined;
}

export async function getEventById(id: string): Promise<EventRecord | undefined> {
    const rows = await sql`select * from events where id = ${id} limit 1`;
    return rows[0] ? mapRow(rows[0]) : undefined;
}

export async function createEvent(
    input: Omit<EventRecord, "id" | "createdAt" | "status"> & { status?: EventStatus }
  ): Promise<EventRecord> {
    const id = generateId("evt");
    const status = input.status ?? "draft";
    const rows = await sql`
        insert into events (id, organizer_id, slug, name, category, description, date, time, venue, address, city, capacity, status)
            values (${id}, ${input.organizerId}, ${input.slug}, ${input.name}, ${input.category}, ${input.description}, ${input.date}, ${input.time}, ${input.venue}, ${input.address}, ${input.city}, ${input.capacity}, ${status})
                returning *
                  `;
    return mapRow(rows[0]);
}

export async function publishEvent(id: string): Promise<EventRecord | undefined> {
    const rows = await sql`update events set status = 'published' where id = ${id} returning *`;
    return rows[0] ? mapRow(rows[0]) : undefined;
}

export async function cancelEvent(id: string): Promise<EventRecord | undefined> {
    const rows = await sql`update events set status = 'cancelled' where id = ${id} returning *`;
    return rows[0] ? mapRow(rows[0]) : undefined;
}


export async function listAllEvents(): Promise<EventRecord[]> {
      const rows = await sql`select * from events order by created_at desc`;
      return rows.map(mapRow);
}
