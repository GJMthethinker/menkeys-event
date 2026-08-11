import { listPublishedEvents } from "@/lib/data/events";
import { listTicketTypesByEvent } from "@/lib/data/tickets";

export default async function Home() {
  const publishedEvents = await listPublishedEvents();

  return (
    <main className="min-h-screen px-6 py-16 sm:px-10">
      <p className="font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-crimson">
        Fondations — Étape 1
      </p>
      <h1 className="mt-3 font-display text-4xl uppercase sm:text-6xl">
        Menkeys Event
      </h1>
      <p className="mt-4 max-w-lg text-sm text-muted">
        Le projet est câblé de bout en bout : modèle de données, couche de
        données simulée et design system. Les événements ci-dessous viennent
        réellement de <code className="text-ivory">lib/data/events.ts</code>.
      </p>

      <div className="mt-10 space-y-4">
        {publishedEvents.map(async (event) => {
          const ticketTypes = await listTicketTypesByEvent(event.id);
          return (
            <div
              key={event.id}
              className="clip-corner-tr border border-line bg-surface p-5"
            >
              <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-muted">
                {event.date} · {event.venue}, {event.city}
              </p>
              <h2 className="mt-1 font-display text-2xl">{event.name}</h2>
              <div className="mt-3 flex gap-4 text-xs text-muted">
                {ticketTypes.map((t) => (
                  <span key={t.id}>
                    {t.name} —{" "}
                    <span className="text-ivory">
                      {t.price} {t.currency}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-16 border-t border-line pt-6">
        <p className="font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-muted">
          Prochaines étapes
        </p>
        <ul className="mt-3 space-y-1 text-sm text-muted">
          <li>2 — Espace Organisateur (création de compte, création d'événement)</li>
          <li>3 — Page publique + Billetterie (intégration du prototype)</li>
          <li>4 — Achat &amp; billet numérique (QR Code)</li>
          <li>5 — Menkeys Scan (contrôle d'accès)</li>
          <li>6 — Dashboard Organisateur (ventes, statistiques)</li>
          <li>7 — Discover (recherche d'événements)</li>
        </ul>
      </div>
    </main>
  );
}
