import { events } from "@/lib/data/store";
import { generateId } from "@/lib/id";
import type { EventRecord, EventStatus } from "@/lib/types";

// Toutes les fonctions sont async : ça garde l'API identique le jour où
// elles interrogeront une vraie base de données au lieu du tableau en mémoire.

export async function listPublishedEvents(): Promise<EventRecord[]> {
  return events.filter((e) => e.status === "published");
}

export async function listEventsByOrganizer(
  organizerId: string
): Promise<EventRecord[]> {
  return events.filter((e) => e.organizerId === organizerId);
}

export async function getEventBySlug(
  slug: string
): Promise<EventRecord | undefined> {
  return events.find((e) => e.slug === slug);
}

export async function getEventById(
  id: string
): Promise<EventRecord | undefined> {
  return events.find((e) => e.id === id);
}

export async function createEvent(
  input: Omit<EventRecord, "id" | "createdAt" | "status"> & {
    status?: EventStatus;
  }
): Promise<EventRecord> {
  const record: EventRecord = {
    ...input,
    id: generateId("evt"),
    status: input.status ?? "draft",
    createdAt: new Date().toISOString(),
  };
  events.push(record);
  return record;
}

export async function publishEvent(
  id: string
): Promise<EventRecord | undefined> {
  const record = events.find((e) => e.id === id);
  if (record) record.status = "published";
  return record;
}

export async function cancelEvent(
  id: string
): Promise<EventRecord | undefined> {
  const record = events.find((e) => e.id === id);
  if (record) record.status = "cancelled";
  return record;
}
