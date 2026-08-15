"use server";

import { scanTicket } from "@/lib/data/scan";

export async function scanTicketAction(code: string) {
    return scanTicket(code, "agent_demo");
}
