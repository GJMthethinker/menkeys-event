/**
 * MODÈLE DE DONNÉES — MENKEYS EVENT
 * ----------------------------------
 * Ce fichier est la source de vérité pour la forme des données dans toute
 * l'application. Il ne dépend d'aucune techno de stockage : que les données
 * viennent du mock store (lib/data/store.ts) ou plus tard d'une vraie base
 * (Postgres/Prisma, etc.), elles respectent ces types.
 */

// ---------- ORGANISATEUR ----------

export type OrganizerPlan = "free" | "pro" | "business";

export interface Organizer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  logoUrl?: string;
  verified: boolean; // Menkeys Verified — section 26 du cahier des charges
  plan: OrganizerPlan;
  createdAt: string;
}

// Rôles d'équipe — section 22 du cahier des charges
export type TeamRole =
  | "admin"                // accès complet
  | "ticketing_manager"    // gestion des billets
  | "entry_agent"          // accès au scanner uniquement
  | "communication_manager"; // gestion des infos promotionnelles

export interface TeamMember {
  id: string;
  organizerId: string;
  name: string;
  email: string;
  role: TeamRole;
  invitedAt: string;
}

// ---------- ÉVÉNEMENT ----------

export type EventCategory =
  | "musique"
  | "culture"
  | "sport"
  | "education"
  | "business"
  | "religion"
  | "loisirs"
  | "competitions";

export type EventStatus = "draft" | "published" | "cancelled" | "completed";

export interface EventRecord {
  id: string;
  organizerId: string;
  slug: string; // utilisé dans menkeysevent.com/evenement/:slug
  name: string;
  category: EventCategory;
  description: string;
  date: string; // ISO date, ex "2027-08-15"
  time: string; // ex "20:00"
  venue: string;
  address: string;
  city: string;
  coverImageUrl?: string;
  capacity: number;
  status: EventStatus;
  createdAt: string;
}

// ---------- BILLETTERIE ----------

export interface TicketType {
  id: string;
  eventId: string;
  name: string; // "Standard", "VIP", "VVIP", ou nom personnalisé
  price: number; // 0 pour un billet gratuit
  currency: "HTG" | "USD";
  quantityTotal: number;
  quantitySold: number;
  perks: string[];
  salesStart?: string;
  salesEnd?: string;
  isFree: boolean;
}

export type PaymentMethod = "moncash" | "card" | "bank_transfer" | "free";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

// Une commande peut contenir plusieurs billets du même type (quantité > 1)
export interface Order {
  id: string;
  eventId: string;
  ticketTypeId: string;
  quantity: number;
  totalAmount: number;
  currency: "HTG" | "USD";
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  participant: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
  };
  createdAt: string;
}

export type TicketStatus = "valid" | "used" | "cancelled";

// Un billet numérique individuel et scannable — généré après paiement (section 12)
export interface Ticket {
  id: string;
  code: string; // ex "MK-847293", imprimé sur le billet
  orderId: string;
  eventId: string;
  ticketTypeId: string;
  holderName: string;
  status: TicketStatus;
  qrPayload: string; // contenu encodé dans le QR Code
  issuedAt: string;
  usedAt?: string;
  scannedBy?: string; // id du membre d'équipe / agent d'entrée
}

// ---------- MENKEYS SCAN ----------

export type ScanResult = "granted" | "already_used" | "invalid";

export interface ScanLog {
  id: string;
  ticketCode: string;
  eventId: string;
  result: ScanResult;
  scannedAt: string;
  agentId?: string;
  offline?: boolean; // mode hors connexion — section 15
}
