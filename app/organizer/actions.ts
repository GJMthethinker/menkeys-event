"use server";

import { createEvent, publishEvent } from "@/lib/data/events";
import { createServiceRequest } from "@/lib/data/services";
import type { ServiceType } from "@/lib/types";
import { createTicketType } from "@/lib/data/tickets";
import type { EventCategory } from "@/lib/types";
import { signupOrganizer, verifyOrganizerLogin } from "@/lib/data/organizers";
import { verifyAdminLogin } from "@/lib/data/admins";
import { createSession, destroySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { requireOrganizer } from "@/lib/auth";

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
            const organizerId = await requireOrganizer();
            return createEvent({ ...input, organizerId });
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


export async function signupOrganizerAction(input: {
        name: string;
        email: string;
        password: string;
        phone?: string;
}) {
        const result = await signupOrganizer(input);
        if (!result.ok || !result.organizerId) return result;
        await createSession("organizer", result.organizerId);
        return result;
}

export async function loginOrganizerAction(email: string, password: string) {
        const organizerId = await verifyOrganizerLogin(email, password);
        if (!organizerId) return { ok: false };
        await createSession("organizer", organizerId);
        return { ok: true };
}

export async function logoutOrganizerAction() {
        await destroySession();
        redirect("/organizer/login");
}

export async function loginAdminAction(email: string, password: string) {
        const adminId = await verifyAdminLogin(email, password);
        if (!adminId) return { ok: false };
        await createSession("admin", adminId);
        return { ok: true };
}

export async function logoutAdminAction() {
        await destroySession();
        redirect("/admin/login");
}
