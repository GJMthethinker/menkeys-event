"use server";

import { createEvent, publishEvent } from "@/lib/data/events";
import { createServiceRequest } from "@/lib/data/services";
import type { ServiceType } from "@/lib/types";
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
    currency:  "HTG" | "USD";
    quantityTotal: number;
    perks: string[];
    isFree: boolean;
}) {
    return createTicketType(input);
}

export async function publishEventAction(eventId: string) {
    return publishEvent(eventId);
}


export async function requestServiceAction(input: {
        eventId: string;
        organizerId: string;
        type: ServiceType;
        quantity: number;
        contactName: string;
        contactPhone: string;
        notes?: string;
}) {
        return createServiceRequest(input);
}
