# Menkeys Event — Fondations

Projet Next.js (App Router) + TypeScript + Tailwind. Cette étape pose la base
technique : modèle de données, couche de données simulée, design system.

## Lancer le projet en local

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000 — tu devrais voir l'événement de
démonstration (Eloquenza) chargé depuis la couche de données.

## Structure

```
app/                 pages (App Router)
  layout.tsx          police + shell global
  page.tsx             page d'accueil de démonstration
  globals.css           styles de base + tokens Tailwind

lib/
  types.ts             modèle de données de toute la plateforme
  id.ts                génération d'identifiants / codes billet / QR
  data/
    store.ts            "base de données" en mémoire (données de seed)
    events.ts            requêtes/écritures sur les événements
    tickets.ts            requêtes/écritures sur les catégories de billets
    orders.ts              flux d'achat : commande -> paiement -> billets
    organizers.ts            comptes organisateurs + équipe

components/           composants d'interface (à remplir aux prochaines étapes)
```

## Pourquoi une "couche de données simulée" ?

Chaque fichier dans `lib/data/*.ts` n'expose que des fonctions asynchrones
(`listPublishedEvents()`, `createOrder()`, etc.). Aucun composant de l'app
n'importe jamais `store.ts` directement. Résultat : le jour où on branche une
vraie base (Postgres via Prisma, Supabase, etc.), on réécrit uniquement
l'intérieur de ces fonctions — le reste du projet ne change pas.

## Ce qui reste simulé pour l'instant (à brancher plus tard, avec tes clés)

- **Paiement** (`lib/data/orders.ts`) : `paymentStatus` passe à `"paid"`
  immédiatement. À remplacer par un appel réel à MonCash / un prestataire
  carte, avec un statut `"pending"` en attendant leur webhook de
  confirmation.
- **Authentification** : pas encore implémentée (prévue à l'étape 2, Espace
  Organisateur) — utilisera un vrai fournisseur (NextAuth, Clerk, etc.) le
  moment venu.
- **Base de données** : `lib/data/store.ts` réinitialise ses données à
  chaque redémarrage du serveur.

## Prochaines étapes

2. Espace Organisateur — création de compte, création d'événement
3. Page publique + Billetterie — intégration du prototype validé
4. Achat & billet numérique (QR Code)
5. Menkeys Scan — contrôle d'accès
6. Dashboard Organisateur — ventes, statistiques
7. Discover — recherche d'événements
8. Paiement réel & authentification réelle (nécessite tes propres clés de service)
