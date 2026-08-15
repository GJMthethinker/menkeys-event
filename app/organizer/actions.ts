"use server";

import { createEvent, publishEvent } from "@/lib/data/events";
import { createTicketType } from "@/lib/data/tickets";
import type { EventCategory } from "@/lib/types";

export async function createEventAction(input: {
    organizerId: string;
    slug: string;
    name: string;
    category: EventCategory;
    description: string;
    date: string;
    time: string;
    venue: string;
    address: string;
    city: string;
    capacity: number;
}) {
    return createEvent(input);
}

export async function createTicketTypeAction(input: {
    eventId: string;
    name: string;
    price: number;
    currency: string;
    quantityTotal: number;
    perks: string[];
    isFree: boolean;
}) {
    return createTicketType(input);
}

export async function publishEventAction(eventId: string) {
    return publishEvent(eventId);
}
