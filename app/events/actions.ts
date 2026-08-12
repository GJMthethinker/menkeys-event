"use server";

import { createOrder } from "@/lib/data/orders";
import type { PaymentMethod } from "@/lib/types";

export async function purchaseTickets(input: {
    eventId: string;
    ticketTypeId: string;
    quantity: number;
    paymentMethod: PaymentMethod;
    participant: {
      firstName: string;
      lastName: string;
      phone: string;
      email?: string;
    };
}) {
    return createOrder(input);
}
