// Génération d'identifiants. En dev on utilise un compteur simple + random ;
// en prod, on pourra passer à uuid/cuid sans changer les appelants.

let counter = 1000;

export function generateId(prefix: string): string {
  counter += 1;
  return `${prefix}_${counter}${Math.floor(Math.random() * 1000)}`;
}

// Ticket code lisible par un humain, imprimé sur le billet (section 12).
export function generateTicketCode(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `MK-${n}`;
}

// Contenu encodé dans le QR — doit être vérifiable côté scan sans appel réseau
// grâce à la signature, pour supporter le mode hors connexion (section 15).
export function generateQrPayload(ticketCode: string, eventId: string): string {
  return `menkeys://ticket/${eventId}/${ticketCode}`;
}
