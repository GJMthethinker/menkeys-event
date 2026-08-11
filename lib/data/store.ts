/**
 * MOCK DATA STORE
 * ----------------
 * Stockage en mémoire pour le développement. C'est la SEULE partie du projet
 * qui devra être remplacée quand on branchera une vraie base de données
 * (ex: Postgres + Prisma). Tous les fichiers dans lib/data/*.ts n'exposent
 * que des fonctions async (listEvents, createOrder, etc.) — le reste de
 * l'app ne touche jamais ce fichier directement, donc le remplacement du
 * stockage n'impactera aucun composant.
 *
 * Les données repartent de zéro à chaque redémarrage du serveur dev.
 */

import type {
  Organizer,
  TeamMember,
  EventRecord,
  TicketType,
  Order,
  Ticket,
  ScanLog,
} from "@/lib/types";

export const organizers: Organizer[] = [
  {
    id: "org_1",
    name: "The Menkeys Production",
    email: "contact@themenkeysproduction.com",
    verified: true,
    plan: "pro",
    createdAt: "2026-01-10T00:00:00.000Z",
  },
];

export const teamMembers: TeamMember[] = [
  {
    id: "team_1",
    organizerId: "org_1",
    name: "José Manuel Gilles",
    email: "jose@themenkeysproduction.com",
    role: "admin",
    invitedAt: "2026-01-10T00:00:00.000Z",
  },
];

export const events: EventRecord[] = [
  {
    id: "evt_1",
    organizerId: "org_1",
    slug: "eloquenza",
    name: "ELOQUENZA",
    category: "culture",
    description:
      "Une soirée où la parole devient spectacle. Poésie, musique live et mise en scène se rencontrent pour une expérience unique, portée par les voix les plus affirmées de la scène haïtienne contemporaine.",
    date: "2027-08-15",
    time: "20:00",
    venue: "Place d'Armes",
    address: "Place d'Armes",
    city: "Gonaïves, Haïti",
    capacity: 700,
    status: "published",
    createdAt: "2026-02-01T00:00:00.000Z",
  },
];

export const ticketTypes: TicketType[] = [
  {
    id: "tt_standard",
    eventId: "evt_1",
    name: "Standard",
    price: 500,
    currency: "HTG",
    quantityTotal: 500,
    quantitySold: 214,
    perks: ["Accès général", "Placement libre"],
    isFree: false,
  },
  {
    id: "tt_vip",
    eventId: "evt_1",
    name: "VIP",
    price: 1500,
    currency: "HTG",
    quantityTotal: 150,
    quantitySold: 96,
    perks: ["Zone réservée", "Accès prioritaire", "1 boisson offerte"],
    isFree: false,
  },
  {
    id: "tt_vvip",
    eventId: "evt_1",
    name: "VVIP",
    price: 3000,
    currency: "HTG",
    quantityTotal: 50,
    quantitySold: 31,
    perks: ["Table privée", "Service dédié", "Rencontre artistes", "Parking réservé"],
    isFree: false,
  },
];

export const orders: Order[] = [];
export const tickets: Ticket[] = [];
export const scanLogs: ScanLog[] = [];
